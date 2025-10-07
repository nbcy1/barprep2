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

type TopicStats = {
  total: number;
  correct: number;
};

export default function Questions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);
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
        const validQuestions = items.filter(
          (q): q is Question =>
            q &&
            typeof q.id === "string" &&
            typeof q.question === "string" &&
            Array.isArray(q.choices) &&
            typeof q.answer === "string"
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

  if (loading) return <div style={{ padding: "2rem" }}>Loading questions...</div>;
  if (error) return <div style={{ padding: "2rem", color: "red" }}>Error: {error}</div>;
  if (questions.length === 0) return <div style={{ padding: "2rem" }}>No questions available.</div>;

  const currentQuestion = questions[currentIndex];
  const isAnswered = currentAnswer !== null;

  const handleChoiceSelect = (choice: string) => {
    if (isAnswered) return;
    setCurrentAnswer(choice);
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: choice }));
  };

  const handleNext = () => {
    setCurrentAnswer(null);
    if (currentIndex + 1 >= questions.length) {
      setSessionFinished(true);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleExitSession = () => {
    setSessionFinished(true);
  };

  const handleNewSession = () => {
    setCurrentIndex(0);
    setCurrentAnswer(null);
    setAnswers({});
    setSessionFinished(false);
  };

  const totalAnswered = Object.keys(answers).length;
  const totalCorrect = Object.entries(answers).filter(
    ([id, answer]) => questions.find((q) => q.id === id)?.answer === answer
  ).length;

  const getColor = (percent: number) => {
    if (percent < 50) return "#dc3545"; // red
    if (percent < 75) return "#ffc107"; // yellow
    return "#28a745"; // green
  };

  const topicStats: Record<string, TopicStats> = {};
  Object.entries(answers).forEach(([id, answer]) => {
    const question = questions.find((q) => q.id === id);
    if (!question) return;
    const topic = question.topic || "General";
    if (!topicStats[topic]) topicStats[topic] = { total: 0, correct: 0 };
    topicStats[topic].total += 1;
    if (answer === question.answer) topicStats[topic].correct += 1;
  });

  const wrongQuestions = questions.filter(
    (q) => answers[q.id] && answers[q.id] !== q.answer
  );

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
              <div key={q.id} style={{ padding: "0.5rem", marginBottom: "0.5rem", backgroundColor: "#f8d7da", borderRadius: "4px" }}>
                <p><strong>Q:</strong> {q.question}</p>
                <p><strong>Your Answer:</strong> {answers[q.id]}</p>
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

  return (
    <div style={{ padding: "1rem", maxWidth: "800px", margin: "0 auto", fontSize: "0.9rem" }}>
      {/* Session Stats */}
      <div style={{ marginBottom: "0.5rem" }}>
        <p style={{ marginBottom: "0.25rem" }}>Correct: {totalCorrect}/{totalAnswered}</p>
        <div style={{ backgroundColor: "#eee", borderRadius: "4px", height: "10px", marginBottom: "0.5rem" }}>
          <div
            style={{
              width: totalAnswered ? `${Math.round((totalCorrect/totalAnswered)*100)}%` : "0%",
              height: "100%",
              borderRadius: "4px",
              backgroundColor: getColor(totalAnswered ? Math.round((totalCorrect/totalAnswered)*100) : 0),
            }}
          />
        </div>
      </div>

      {/* Scrollable Question/Choices */}
      <div style={{ maxHeight: "400px", overflowY: "auto", paddingRight: "0.5rem" }}>
        <p style={{ marginBottom: "0.25rem" }}><strong>Q:</strong> {currentQuestion.question}</p>
        {currentQuestion.choices.map((choice, idx) => {
          let bg = "white";
          let border = "#ccc";
          if (isAnswered) {
            if (choice === currentQuestion.answer) { bg = "#d4edda"; border = "#28a745"; }
            else if (choice === currentAnswer) { bg = "#f8d7da"; border = "#dc3545"; }
          }

          return (
            <div
              key={idx}
              onClick={() => handleChoiceSelect(choice)}
              style={{
                padding: "0.5rem",
                marginBottom: "0.25rem",
                border: `2px solid ${border}`,
                borderRadius: "4px",
                backgroundColor: bg,
                cursor: isAnswered ? "default" : "pointer",
                transition: "all 0.2s",
                fontSize: "0.85rem"
              }}
            >
              <input type="radio" checked={currentAnswer === choice} readOnly style={{ marginRight: "0.25rem" }} />
              {choice}
              {isAnswered && choice === currentQuestion.answer && " ✓"}
              {isAnswered && choice === currentAnswer && choice !== currentQuestion.answer && " ✗"}
            </div>
          );
        })}
        {isAnswered && currentQuestion.explanation && (
          <p style={{ marginTop: "0.25rem", backgroundColor: "#fff3cd", padding: "0.25rem", borderRadius: "4px", fontSize: "0.8rem" }}>
            <strong>Explanation:</strong> {currentQuestion.explanation}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
        <button
          onClick={handleExitSession}
          style={{ padding: "0.5rem 1rem", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem" }}
        >
          Exit Session
        </button>
        {isAnswered && (
          <button
            onClick={handleNext}
            style={{ padding: "0.5rem 1rem", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem" }}
          >
            {currentIndex + 1 >= questions.length ? "Finish Session" : "Next Question"}
          </button>
        )}
      </div>
    </div>
  );
}


