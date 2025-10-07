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

  const currentQuestion = questions[currentIndex];
  const hasAnswered = !!answers[currentQuestion.id];
  const isCorrect = hasAnswered && answers[currentQuestion.id] === currentQuestion.answer;

  const handleSelect = (choice: string) => {
    if (hasAnswered) return;
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: choice }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(prev => prev + 1);
    else setSessionFinished(true);
  };

  const handleExitSession = () => setSessionFinished(true);
  const handleNewSession = () => {
    setCurrentIndex(0);
    setAnswers({});
    setSessionFinished(false);
  };

  // --- Calculate overall and per-topic stats ---
  const answeredCount = Object.keys(answers).length;
  const correctCount = Object.keys(answers).filter(qId => answers[qId] === questions.find(q => q.id === qId)?.answer).length;
  const overallPercent = answeredCount ? (correctCount / answeredCount) * 100 : 0;
  const overallColor = overallPercent < 50 ? "#dc3545" : overallPercent < 75 ? "#ffc107" : "#28a745";

  const topicStats = useMemo(() => {
    const stats: Record<string, { correct: number; total: number }> = {};
    Object.keys(answers).forEach(qId => {
      const question = questions.find(q => q.id === qId);
      if (!question) return;
      const topic = question.topic || "General";
      if (!stats[topic]) stats[topic] = { correct: 0, total: 0 };
      stats[topic].total += 1;
      if (answers[qId] === question.answer) stats[topic].correct += 1;
    });
    return stats;
  }, [answers, questions]);

  const wrongQuestions = questions.filter(q => answers[q.id] && answers[q.id] !== q.answer);

  // --- Session summary screen ---
  if (sessionFinished) {
    return (
      <div style={{ padding: "1rem", maxWidth: "700px", margin: "0 auto" }}>
        <h2>Session Complete!</h2>

        {/* Overall stats */}
        <div style={{ marginBottom: "1rem" }}>
          <p style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>Correct: {correctCount}/{answeredCount} ({Math.round(overallPercent)}%)</p>
          <div style={{ height: "15px", backgroundColor: "#eee", borderRadius: "8px", overflow: "hidden" }}>
            <div style={{ width: `${overallPercent}%`, height: "100%", backgroundColor: overallColor, transition: "width 0.3s" }} />
          </div>
        </div>

        {/* Per-topic stats */}
        {Object.entries(topicStats).map(([topic, stat]) => {
          const percent = stat.total ? (stat.correct / stat.total) * 100 : 0;
          const color = percent < 50 ? "#dc3545" : percent < 75 ? "#ffc107" : "#28a745";
          return (
            <div key={topic} style={{ marginBottom: "0.75rem" }}>
              <p style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>{topic}: {stat.correct}/{stat.total} ({Math.round(percent)}%)</p>
              <div style={{ height: "10px", backgroundColor: "#eee", borderRadius: "8px", overflow: "hidden" }}>
                <div style={{ width: `${percent}%`, height: "100%", backgroundColor: color, transition: "width 0.3s" }} />
              </div>
            </div>
          );
        })}

        {/* Wrong questions review */}
        {wrongQuestions.length > 0 && (
          <div style={{ marginTop: "1rem" }}>
            <h3>Questions Answered Incorrectly:</h3>
            {wrongQuestions.map(q => (
              <div key={q.id} style={{ marginBottom: "1rem", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "6px", backgroundColor: "#fff3cd" }}>
                <p style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>{q.question}</p>
                <p style={{ marginBottom: "0.25rem" }}>Your answer: {answers[q.id]}</p>
                <p style={{ margin: 0 }}>Explanation: {q.explanation}</p>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleNewSession}
          style={{ marginTop: "1rem", padding: "0.5rem 1.5rem", fontSize: "1rem", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
        >
          Begin New Session
        </button>
      </div>
    );
  }

  // --- Current question screen ---
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
        <div style={{
          width: `${answeredCount ? (correctCount / answeredCount) * 100 : 0}%`,
          height: "100%",
          backgroundColor: answeredCount ? (correctCount / answeredCount) * 100 < 50 ? "#dc3545" : (correctCount / answeredCount) * 100 < 75 ? "#ffc107" : "#28a745" : "#ccc",
          transition: "width 0.3s"
        }} />
      </div>
      <div style={{ fontSize: "0.85rem", marginBottom: "1rem", fontWeight: "bold" }}>
        Correct: {correctCount}/{answeredCount} ({Math.round(answeredCount ? (correctCount / answeredCount) * 100 : 0)}%)
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
