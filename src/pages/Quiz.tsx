import { useEffect, useState, useMemo } from "react";
import { generateClient } from "aws-amplify/api";
import { useAuthenticator } from '@aws-amplify/ui-react';

type Question = {
  id: string;
  question: string;
  choices: string[];
  answer: string;
  explanation?: string;
  topic?: string;
};

export default function Quiz() {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [numQuestions, setNumQuestions] = useState(10);
  const [selectedTopic, setSelectedTopic] = useState("all");

  const client = useMemo(() => generateClient(), []);
  const { user } = useAuthenticator((context) => [context.user]);

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const result = await client.graphql({
          query: `
            query ListQuestions {
              listQuestions {
                items {
                  id
                  question
                  choices
                  answer
                  explanation
                  topic
                }
              }
            }
          `,
        });
        
        const items = result.data?.listQuestions?.items || [];
        const validQuestions = items.filter((q: any) => 
          q !== null && 
          q.question && 
          q.choices && 
          q.answer
        );
        setAllQuestions(validQuestions);
        setError(null);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to load questions");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [client]);

  // Extract unique topics
  const availableTopics = useMemo(() => {
    const topics = new Set(allQuestions.map(q => q.topic).filter(Boolean));
    return Array.from(topics).sort();
  }, [allQuestions]);

  // Start quiz
  const startQuiz = () => {
    let filteredQuestions = allQuestions;
    if (selectedTopic !== "all") {
      filteredQuestions = allQuestions.filter(q => q.topic === selectedTopic);
    }
    if (filteredQuestions.length === 0) {
      alert("No questions available for this topic");
      return;
    }
    const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(numQuestions, filteredQuestions.length));
    setQuizQuestions(selected);
    setAnswers({});
    setQuizStarted(true);
    setQuizSubmitted(false);
  };

  // Handle answer selection
  const handleChoiceSelect = (questionId: string, choice: string) => {
    if (quizSubmitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: choice }));
  };

  // Calculate score
  const calculateScore = () => {
    let correct = 0;
    quizQuestions.forEach(q => {
      if (answers[q.id] === q.answer) correct++;
    });
    return { correct, total: quizQuestions.length };
  };

  // Save quiz result to backend
  const saveQuizResult = async (correct: number, total: number) => {
    if (!user) {
      console.log("User not authenticated, skipping save");
      return;
    }

    try {
      setSaving(true);
      
      // Save overall quiz result
      const input = {
        userId: user.userId || user.username,
        score: correct,
        total,
        answers: JSON.stringify(answers),
      };

      console.log("Saving quiz result with input:", input);

      await client.graphql({
        query: `
          mutation CreateQuizHistory($input: CreateQuizHistoryInput!) {
            createQuizHistory(input: $input) {
              id
              userId
              score
              total
              answers
              createdAt
            }
          }
        `,
        variables: { input },
        authMode: "userPool" as any,
      });

      // Save individual question attempts
      for (const question of quizQuestions) {
        const userAnswer = answers[question.id];
        if (userAnswer) {
          try {
            await client.graphql({
              query: `
                mutation CreateQuestionAttempt($input: CreateQuestionAttemptInput!) {
                  createQuestionAttempt(input: $input) {
                    id
                  }
                }
              `,
              variables: {
                input: {
                  questionId: question.id,
                  userAnswer: userAnswer,
                  correctAnswer: question.answer,
                  isCorrect: userAnswer === question.answer,
                  topic: question.topic || "Uncategorized",
                  attemptType: "quiz"
                }
              },
              authMode: "userPool" as any
            });
          } catch (err) {
            console.error("Error saving question attempt:", err);
          }
        }
      }

      console.log("Quiz result saved successfully");
    } catch (err) {
      console.error("Error saving quiz result:", err);
      console.error("Full error:", JSON.stringify(err, null, 2));
    } finally {
      setSaving(false);
    }
  };

  // Handle quiz submission
  const handleSubmit = async () => {
    if (Object.keys(answers).length < quizQuestions.length) {
      alert("Please answer all questions before submitting");
      return;
    }
    setQuizSubmitted(true);
    const { correct, total } = calculateScore();
    if (user) {
      await saveQuizResult(correct, total);
    }
  };

  const handleReset = () => {
    setQuizStarted(false);
    setQuizSubmitted(false);
    setAnswers({});
    setQuizQuestions([]);
  };

  if (loading) return <div style={{ padding: "2rem" }}>Loading questions...</div>;
  if (error) return <div style={{ padding: "2rem", color: "red" }}>Error: {error}</div>;

  // Quiz setup UI
  if (!quizStarted) {
    return (
      <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
        <h1>Start a Quiz</h1>
        {!user && (
          <div style={{ padding: "1rem", backgroundColor: "#fff3cd", borderRadius: "4px", marginBottom: "1rem" }}>
            <strong>Note:</strong> Log in to save your quiz results and track progress.
          </div>
        )}

        <div style={{ backgroundColor: "#f5f5f5", padding: "2rem", borderRadius: "8px", marginTop: "2rem" }}>
          <label>Number of Questions:</label>
          <input
            type="number"
            min="1"
            max={allQuestions.length}
            value={numQuestions}
            onChange={e => setNumQuestions(parseInt(e.target.value) || 1)}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />

          <label>Topic:</label>
          <select
            value={selectedTopic}
            onChange={e => setSelectedTopic(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          >
            <option value="all">All Topics</option>
            {availableTopics.map(topic => <option key={topic} value={topic}>{topic}</option>)}
          </select>

          <button onClick={startQuiz} style={{ width: "100%", padding: "1rem", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  const score = quizSubmitted ? calculateScore() : null;

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Quiz - {selectedTopic === "all" ? "All Topics" : selectedTopic}</h1>

      {quizSubmitted && score && (
        <div style={{
          backgroundColor: score.correct === score.total ? "#d4edda" : "#fff3cd",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "2rem",
          border: `2px solid ${score.correct === score.total ? "#28a745" : "#ffc107"}`
        }}>
          <h2>Quiz Complete!</h2>
          <p>Score: {score.correct} / {score.total} ({Math.round((score.correct / score.total) * 100)}%)</p>
          {user && saving && <p>Saving result...</p>}
          {user && !saving && <p style={{ color: "#28a745" }}>✓ Result saved!</p>}
          {!user && <p style={{ color: "#856404" }}>Sign in to save your results</p>}
        </div>
      )}

      {quizQuestions.map((q, index) => {
        const userAnswer = answers[q.id];
        const isCorrect = quizSubmitted && userAnswer === q.answer;
        const isIncorrect = quizSubmitted && userAnswer && userAnswer !== q.answer;

        return (
          <div key={q.id} style={{ marginBottom: "2rem", padding: "1.5rem", backgroundColor: "white", border: quizSubmitted ? isCorrect ? "2px solid #28a745" : isIncorrect ? "2px solid #dc3545" : "1px solid #ccc" : "1px solid #ccc", borderRadius: "8px" }}>
            <h3>Question {index + 1}</h3>
            <p style={{ fontSize: "1.1rem" }}>{q.question}</p>
            <div style={{ marginTop: "1rem" }}>
              {q.choices.map((choice, idx) => {
                const isSelected = userAnswer === choice;
                const isCorrectAnswer = choice === q.answer;
                let backgroundColor = "white";
                let borderColor = "#ccc";
                if (quizSubmitted) {
                  if (isCorrectAnswer) { backgroundColor = "#d4edda"; borderColor = "#28a745"; }
                  else if (isSelected) { backgroundColor = "#f8d7da"; borderColor = "#dc3545"; }
                } else if (isSelected) {
                  backgroundColor = "#e7f3ff"; borderColor = "#007bff";
                }
                return (
                  <div 
                    key={idx} 
                    onClick={() => handleChoiceSelect(q.id, choice)} 
                    style={{ 
                      padding: "1rem", 
                      marginBottom: "0.5rem", 
                      border: `2px solid ${borderColor}`, 
                      borderRadius: "6px", 
                      cursor: quizSubmitted ? "default" : "pointer", 
                      backgroundColor,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem"
                    }}
                  >
                    <input 
                      type="radio" 
                      name={`question-${q.id}`} 
                      checked={isSelected} 
                      onChange={() => handleChoiceSelect(q.id, choice)} 
                      disabled={quizSubmitted} 
                      style={{ cursor: quizSubmitted ? "default" : "pointer" }}
                    />
                    <span style={{ flex: 1 }}>
                      {choice}
                      {quizSubmitted && isCorrectAnswer && " ✓ (Correct Answer)"}
                      {quizSubmitted && isSelected && !isCorrectAnswer && " ✗ (Your Answer)"}
                    </span>
                  </div>
                );
              })}
            </div>
            {quizSubmitted && q.explanation && (
              <div style={{ 
                marginTop: "1rem", 
                padding: "1rem", 
                backgroundColor: isCorrect ? "#d4edda" : "#fff3cd", 
                borderRadius: "4px",
                borderLeft: `4px solid ${isCorrect ? "#28a745" : "#ffc107"}`
              }}>
                <strong style={{ display: "block", marginBottom: "0.5rem" }}>Explanation:</strong>
                <p style={{ margin: 0 }}>{q.explanation}</p>
              </div>
            )}
          </div>
        );
      })}

      <div style={{ marginTop: "2rem" }}>
        {!quizSubmitted ? (
          <button 
            onClick={handleSubmit} 
            style={{ 
              padding: "0.75rem 2rem", 
              backgroundColor: "#007bff", 
              color: "white", 
              border: "none", 
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "1rem"
            }}
          >
            Submit Quiz
          </button>
        ) : (
          <button 
            onClick={handleReset} 
            style={{ 
              padding: "0.75rem 2rem", 
              backgroundColor: "#28a745", 
              color: "white", 
              border: "none", 
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "1rem"
            }}
          >
            Take Another Quiz
          </button>
        )}
      </div>
    </div>
  );
}
