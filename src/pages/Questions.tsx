import { useEffect, useState, useMemo } from "react";
import { generateClient } from "aws-amplify/api";

type Question = {
  id: string;
  question: string;
  choices: string[];
  answer: string;
  topic?: string;
};

export default function Questions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const client = useMemo(() => generateClient(), []);

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
                  topic
                }
              }
            }
          `,
        });
        setQuestions(result.data.listQuestions.items);
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

  const handleChoiceSelect = (questionId: string, choice: string) => {
    // Once answered, lock in the answer (no changing)
    if (answers[questionId]) return;
    setAnswers((prev) => ({ ...prev, [questionId]: choice }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length) {
      alert("Please answer all questions before submitting");
      return;
    }
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.answer) {
        correct++;
      }
    });
    return { correct, total: questions.length };
  };

  if (loading) return <div style={{ padding: "2rem" }}>Loading questions...</div>;
  if (error) return <div style={{ padding: "2rem", color: "red" }}>Error: {error}</div>;

  const score = submitted ? calculateScore() : null;

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Bar Prep Questions</h1>
      
      {submitted && score && (
        <div style={{ 
          backgroundColor: score.correct === score.total ? "#d4edda" : "#fff3cd", 
          padding: "1rem", 
          borderRadius: "8px", 
          marginBottom: "2rem",
          border: `2px solid ${score.correct === score.total ? "#28a745" : "#ffc107"}`
        }}>
          <h2>Your Score: {score.correct} / {score.total}</h2>
          <p>
            {score.correct === score.total 
              ? "Perfect score! Excellent work!" 
              : `You got ${Math.round((score.correct / score.total) * 100)}% correct.`}
          </p>
        </div>
      )}

      {questions.length === 0 ? (
        <p>No questions available yet. Check back later!</p>
      ) : (
        <>
          {questions.map((q, index) => {
            const hasAnswered = !!answers[q.id];
            const isCorrect = hasAnswered && answers[q.id] === q.answer;
            const isIncorrect = hasAnswered && answers[q.id] !== q.answer;

            return (
              <div
                key={q.id}
                style={{ 
                  marginBottom: "2rem", 
                  padding: "1.5rem",
                  backgroundColor: "white",
                  border: hasAnswered
                    ? isCorrect ? "2px solid #28a745" : "2px solid #dc3545"
                    : "1px solid #ccc",
                  borderRadius: "8px"
                }}
              >
                <div style={{ marginBottom: "1rem" }}>
                  <h3 style={{ marginBottom: "0.5rem" }}>
                    Question {index + 1}
                    {q.topic && <span style={{ color: "#666", fontSize: "0.9rem", fontWeight: "normal" }}> - {q.topic}</span>}
                  </h3>
                  <p style={{ fontSize: "1.1rem" }}>{q.question}</p>
                </div>

                <div>
                  {q.choices && q.choices.map((choice, choiceIndex) => {
                    const isSelected = answers[q.id] === choice;
                    const isCorrectAnswer = choice === q.answer;
                    const hasAnswered = !!answers[q.id];
                    
                    let backgroundColor = "white";
                    let borderColor = "#ccc";
                    
                    // Show immediate feedback after selecting an answer
                    if (hasAnswered) {
                      if (isCorrectAnswer) {
                        backgroundColor = "#d4edda";
                        borderColor = "#28a745";
                      } else if (isSelected) {
                        backgroundColor = "#f8d7da";
                        borderColor = "#dc3545";
                      }
                    } else if (isSelected) {
                      backgroundColor = "#e7f3ff";
                      borderColor = "#007bff";
                    }

                    return (
                      <div
                        key={choiceIndex}
                        onClick={() => handleChoiceSelect(q.id, choice)}
                        style={{
                          padding: "1rem",
                          marginBottom: "0.5rem",
                          border: `2px solid ${borderColor}`,
                          borderRadius: "6px",
                          cursor: hasAnswered ? "default" : "pointer",
                          backgroundColor,
                          transition: "all 0.2s",
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
                          disabled={hasAnswered}
                          style={{ cursor: hasAnswered ? "default" : "pointer" }}
                        />
                        <span style={{ flex: 1 }}>
                          {choice}
                          {hasAnswered && isCorrectAnswer && " ✓ (Correct Answer)"}
                          {hasAnswered && isSelected && !isCorrectAnswer && " ✗ (Your Answer)"}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {answers[q.id] && answers[q.id] !== q.answer && (
                  <div style={{ marginTop: "1rem", padding: "0.75rem", backgroundColor: "#f8d7da", borderRadius: "4px" }}>
                    <strong>Correct answer:</strong> {q.answer}
                  </div>
                )}
              </div>
            );
          })}

          <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
            {!submitted ? (
              <button
                onClick={handleSubmit}
                style={{ 
                  padding: "0.75rem 2rem", 
                  fontSize: "1rem",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Submit Answers
              </button>
            ) : (
              <button
                onClick={handleReset}
                style={{ 
                  padding: "0.75rem 2rem", 
                  fontSize: "1rem",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Try Again
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
