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
  const [sessionCorrect, setSessionCorrect] = useState(0);
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
          q && typeof q.id === "string" && typeof q.question === "string" && Array.isArray(q.choices) && typeof q.answer === "string"
        );
        setQuestions(validQuestions);
        setError(null);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to load questions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [client]);

  if (loading) return <div style={{ padding: "1rem" }}>Loading questions...</div>;
  if (error) return <div style={{ padding: "1rem", color: "red" }}>Error: {error}</div>;
  if (questions.length === 0) return <div style={{ padding: "1rem" }}>No questions available.</div>;

  // --- Session control functions ---
  const handleSelect = (choice: string) => {
    const currentQuestion = questions[currentIndex];
    if (answers[currentQuestion.id]) return;
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: choice }));
    if (choice === currentQuestion.answer) setSessionCorrect(prev => prev + 1);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(prev => prev + 1);
    else setSessionFinished(true);
  };

  const handleExitSession = () => setSessionFinished(true);

  const handleNewSession = () => {
    setCurrentIndex(0);
    setAnswers({});
    setSessionCorrect(0);
    setSessionFinished(false);
  };

  // --- Derived values ---
  const answeredCount = Object.keys(answers).length;
  const progressPercent = answeredCount ? (sessionCorrect / answeredCount) * 100 : 0;
  const progressColor = progressPercent < 50 ? "#dc3545" : progressPercent < 75 ? "#ffc107" : "#28a745";

  // --- Session summary screen ---
  if (sessionFinished) {
    return (
      <div style={{ padding: "1rem", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        <h2>Session Complete!</h2>
        <p style={{ fontSize: "1.1rem", margin: "1rem 0" }}>
          Correct: {sessionCorrect} / {answeredCount} ({Math.round(progressPercent)}%)
        </p>
        <div style={{ marginBottom: "1rem", height: "20px", backgroundColor: "#eee", borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ width: `${progressPercent}%`, height: "100%", backgroundColor: progressColor, transition: "width 0.3s" }} />
        </div>
        <button
          onClick={handleNewSession}
          style={{ padding: "0.5rem 1.5rem", fontSize: "1rem", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
        >
          Begin New Session
        </button>
      </div>
    );
  }

  // --- Current question screen ---
  const currentQuestion = questions[currentIndex];
  const hasAnswered = !!answers[currentQuestion.id];
  const isCorrect = hasAnswered && answers[currentQuestion.id] === currentQuestion.answer;

  return (
    <div style={{
      padding: "1rem",
      maxWidth: "700px",
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      height: "90vh"
    }}>
      {/* Persistent Exit Session button */}
      <button
        onClick={handleExitSession}
        style={{
          alignSelf: "flex-end",
          padding: "0.25rem 0.5rem",
          fontSize: "0.85rem",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginBottom: "0.5rem"
        }}
      >
        Exit Session
      </button>

      {/* Progress bar */}
      <div style={{ marginBottom: "0.5rem", height: "10px", backgroundColor: "#eee", borderRadius: "5px", overflow: "hidden" }}>
        <div style={{ width: `${progressPercent}%`, height: "100%", backgroundColor: progressColor, transition: "width 0.3s" }} />
      </div>
      <div style={{ fontSize: "0.85rem", marginBottom: "1rem", fontWeight: "bold" }}>
        Correct: {sessionCorrect} / {answeredCount} ({Math.round(progressPercent)}%)
      </div>

      {/* Question container */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "0.5rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#fff"
      }}>
        <h2 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
          {currentQuestion.topic && <span style={{ fontWeight: "normal", color: "#666" }}>{currentQuestion.topic} - </span>}
          Question
        </h2>
        <p style={{ fontSize: "0.95rem", marginBottom: "1rem" }}>{currentQuestion.question}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {currentQuestion.choices.map((choice, idx) => {
            let bg = "white";
            let border = "#ccc";

            if (hasAnswered) {
              if (choice === currentQuestion.answer) { bg = "#d4edda"; border = "#28a745"; }
              else if (choice === answers[currentQuestion.id]) { bg = "#f8d7da"; border = "#dc3545"; }
            } else if (answers[currentQuestion.id] === choice) {
              bg = "#e7f3ff"; border = "#007bff";
            }

            return (
              <div key={idx}
                onClick={() => handleSelect(choice)}
                style={{
                  padding: "0.5rem",
                  border: `2px solid ${border}`,
                  borderRadius: "6px",
                  cursor: hasAnswered ? "default" : "pointer",
                  backgroundColor: bg,
                  fontSize: "0.9rem",
                  transition: "all 0.2s"
                }}
              >
                {choice}
                {hasAnswered && choice === currentQuestion.answer && " ✓"}
                {hasAnswered && choice === answers[currentQuestion.id] && choice !== currentQuestion.answer && " ✗"}
              </div>
            );
          })}
        </div>

        {/* Explanation */}
        {hasAnswered && currentQuestion.explanation && (
          <div style={{
            marginTop: "1rem",
            padding: "0.5rem",
            backgroundColor: isCorrect ? "#d4edda" : "#fff3cd",
            borderLeft: `4px solid ${isCorrect ? "#28a745" : "#ffc107"}`,
            fontSize: "0.85rem"
          }}>
            <strong>Explanation:</strong>
            <p style={{ margin: "0.25rem 0 0 0" }}>{currentQuestion.explanation}</p>
          </div>
        )}
      </div>

      {/* Next / Finish button */}
      {hasAnswered && (
        <button onClick={handleNext} style={{
          marginTop: "0.5rem",
          padding: "0.5rem",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "0.9rem"
        }}>
          {currentIndex < questions.length - 1 ? "Next Question" : "Finish Session"}
        </button>
      )}
    </div>
  );
}
