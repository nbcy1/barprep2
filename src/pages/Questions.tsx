import { useEffect, useState, useMemo } from "react";
import { generateClient } from "aws-amplify/api";

type Question = {
  id: string;
  question: string;
  choices: string[];
  answer: string;
  explanation?: string;
  topic?: string;
};

export default function Questions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sessionFinished, setSessionFinished] = useState(false);
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
                  explanation
                  topic
                }
              }
            }
          `,
        });

        const items = result.data?.listQuestions?.items || [];
        const validQuestions = items.filter((q): q is Question =>
          q !== null &&
          typeof q.id === 'string' &&
          typeof q.question === 'string' &&
          Array.isArray(q.choices) &&
          typeof q.answer === 'string'
        );

        setQuestions(validQuestions);
        setError(null);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to load questions. Please try again later.");
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [client]);

  const handleChoiceSelect = (questionId: string, choice: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: choice }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setSessionFinished(true);
    }
  };

  const handleExit = () => {
    setSessionFinished(true);
  };

  const handleNewSession = () => {
    setAnswers({});
    setCurrentIndex(0);
    setSessionFinished(false);
  };

  const totalAnswered = Object.keys(answers).length;
  const totalCorrect = questions.filter(q => answers[q.id] === q.answer).length;

  // Compute topic-wise stats
  const topicStats: Record<string, { correct: number; total: number }> = {};
  questions.forEach(q => {
    if (!topicStats[q.topic || "Other"]) topicStats[q.topic || "Other"] = { correct: 0, total: 0 };
    if (answers[q.id]) topicStats[q.topic || "Other"].total++;
    if (answers[q.id] === q.answer) topicStats[q.topic || "Other"].correct++;
  });

  // Questions answered incorrectly
  const wrongQuestions = questions.filter(q => answers[q.id] && answers[q.id] !== q.answer);

  // Progress bar color function
  const getColor = (percent: number) => {
    if (percent < 50) return "#dc3545"; // red
    if (percent < 75) return "#ffc107"; // yellow
    return "#28a745"; // green
  };

  if (loading) return <div style={{ padding: "2rem" }}>Loading questions...</div>;
  if (error) return <div style={{ padding: "2rem", color: "red" }}>Error: {error}</div>;

  if (sessionFinished) {
    return (
      <div style={{ padding: "1rem", maxWidth: "800px", margin: "0 auto", fontSize: "0.9rem" }}>
        <h1>Session Summary</h1>

        {/* Overall Stats */}
        <p style={{ marginBottom: "0.25rem" }}>Correct: {totalCorrect}/{totalAnswered} ({totalAnswered ? Math.round((totalCorrect/totalAnswered)*100) : 0}%)</p>
        <div style={{ backgroundColor: "#eee", borderRadius: "4px", height: "10px", marginBottom: "1rem" }}>
          <div
            style={{
              width: totalAnswered ? `${Math.round((totalCorrect/totalAnswered)*100)}%` : "0%",
              height: "100%",
              borderRadius: "4px",
              backgroundColor: getColor(totalAnswered ? Math.round((totalCorrect/totalAnswered)*100) : 0),
            }}
          />
        </div>

        {/* Topic Stats */}
        {Object.entries(topicStats).map(([topic, stats]) => {
          const percent = stats.total ? Math.round((stats.correct / stats.total) * 100) : 0;
          return (
            <div key={topic} style={{ marginBottom: "0.5rem" }}>
              <p style={{ marginBottom: "0.25rem", fontWeight: "bold" }}>{topic} - Correct: {stats.correct}/{stats.total} ({percent}%)</p>
              <div style={{ backgroundColor: "#eee", borderRadius: "4px", height: "8px" }}>
                <div style={{
                  width: `${percent}%`,
                  height: "100%",
                  borderRadius: "4px",
                  backgroundColor: getColor(percent),
                }} />
              </div>
            </div>
          );
        })}

        {/* Wrong Questions */}
        {wrongQuestions.length > 0 && (
          <>
            <h2>Questions Answered Incorrectly</h2>
            {wrongQuestions.map((q) => (
              <div key={q.id} style={{ padding: "0.5rem", marginBottom: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: "white" }}>
                <p><strong>Q:</strong> {q.question}</p>
                <p><strong>Your Answer:</strong> {answers[q.id]}</p>
                <p><strong>Correct Answer:</strong> {q.answer}</p>
                {q.explanation && <p><strong>Explanation:</strong> {q.explanation}</p>}
              </div>
            ))}
          </>
        )}

        <button
          onClick={handleNewSession}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Begin New Session
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const userAnswer = answers[currentQuestion.id];
  const isCorrect = userAnswer === currentQuestion.answer;
  const showAnswer = !!userAnswer;

  const percentCorrect = totalAnswered ? Math.round((totalCorrect/totalAnswered)*100) : 0;

  return (
    <div style={{ padding: "1rem", maxWidth: "800px", margin: "0 auto", fontSize: "0.9rem" }}>
      {/* Progress */}
      <div style={{ marginBottom: "1rem" }}>
        <p style={{ marginBottom: "0.25rem" }}>Correct: {totalCorrect}/{totalAnswered}</p>
        <div style={{ backgroundColor: "#eee", borderRadius: "4px", height: "10px" }}>
          <div style={{
            width: `${percentCorrect}%`,
            height: "100%",
            borderRadius: "4px",
            backgroundColor: getColor(percentCorrect),
          }} />
        </div>
      </div>

      {/* Question */}
      <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px", marginBottom: "1rem", backgroundColor: "white" }}>
        <p style={{ fontWeight: "bold" }}>{currentQuestion.question}</p>
        {currentQuestion.choices.map((choice, idx) => {
          let bg = "white";
          let borderColor = "#ccc";
          if (showAnswer) {
            if (choice === currentQuestion.answer) {
              bg = "#d4edda";
              borderColor = "#28a745";
            } else if (choice === userAnswer) {
              bg = "#fff3cd";
              borderColor = "#ffc107";
            }
          }
          return (
            <div
              key={idx}
              onClick={() => !showAnswer && handleChoiceSelect(currentQuestion.id, choice)}
              style={{
                padding: "0.5rem",
                marginBottom: "0.5rem",
                border: `2px solid ${borderColor}`,
                borderRadius: "4px",
                cursor: showAnswer ? "default" : "pointer",
                backgroundColor: bg,
                transition: "all 0.2s",
              }}
            >
              {choice}
              {showAnswer && choice === currentQuestion.answer && " ✓"}
              {showAnswer && choice === userAnswer && choice !== currentQuestion.answer && " ✗"}
            </div>
          );
        })}

        {showAnswer && currentQuestion.explanation && (
          <p style={{ marginTop: "0.5rem", fontStyle: "italic" }}>{currentQuestion.explanation}</p>
        )}
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {currentIndex < questions.length - 1 ? (
          <button
            onClick={handleNext}
            disabled={!showAnswer}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: showAnswer ? "pointer" : "not-allowed",
            }}
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!showAnswer}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: showAnswer ? "pointer" : "not-allowed",
            }}
          >
            Finish Session
          </button>
        )}
        <button
          onClick={handleExit}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Exit Session
        </button>
      </div>
    </div>
  );
}


