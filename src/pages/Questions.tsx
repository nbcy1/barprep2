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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionFinished, setSessionFinished] = useState(false);

  const client = useMemo(() => generateClient(), []);

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
        const validQuestions = items.filter(
          (q): q is Question =>
            q !== null &&
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

  // Derived values (all hooks must stay at top)
  const currentQuestion = questions[currentIndex];
  const totalAnswered = Object.keys(answers).length;
  const totalCorrect = Object.entries(answers).filter(
    ([id, ans]) => questions.find(q => q.id === id)?.answer === ans
  ).length;

  const wrongQuestions = useMemo(
    () => questions.filter(q => answers[q.id] && answers[q.id] !== q.answer),
    [answers, questions]
  );

  // Topic-wise summary
  const topicSummary = useMemo(() => {
    const topics: Record<string, { correct: number; total: number }> = {};
    questions.forEach(q => {
      const topic = q.topic || "General";
      if (!topics[topic]) topics[topic] = { correct: 0, total: 0 };
      if (answers[q.id]) topics[topic].total++;
      if (answers[q.id] === q.answer) topics[topic].correct++;
    });
    return topics;
  }, [answers, questions]);

  // Handlers
  const handleChoiceSelect = (choice: string) => {
    if (!currentQuestion || answers[currentQuestion.id]) return;
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: choice }));
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setSessionFinished(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleExitSession = () => {
    setSessionFinished(true);
  };

  const handleNewSession = () => {
    setCurrentIndex(0);
    setAnswers({});
    setSessionFinished(false);
  };

  // Helpers
  const getPercentageColor = (percentage: number) => {
    if (percentage < 50) return "#dc3545"; // red
    if (percentage < 75) return "#ffc107"; // yellow
    return "#28a745"; // green
  };

  if (loading) return <div style={{ padding: "2rem" }}>Loading questions...</div>;
  if (error) return <div style={{ padding: "2rem", color: "red" }}>{error}</div>;
  if (questions.length === 0) return <div style={{ padding: "2rem" }}>No questions available.</div>;

  // Summary screen
  if (sessionFinished) {
    const overallPercentage = totalAnswered ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    return (
      <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        <h1>Session Summary</h1>

        {/* Overall */}
        <div style={{ marginBottom: "2rem" }}>
          <strong>Correct: {totalCorrect}/{totalAnswered} ({overallPercentage}%)</strong>
          <div
            style={{
              height: "20px",
              width: "100%",
              backgroundColor: "#e0e0e0",
              borderRadius: "4px",
              overflow: "hidden",
              marginTop: "0.5rem"
            }}
          >
            <div
              style={{
                width: `${overallPercentage}%`,
                backgroundColor: getPercentageColor(overallPercentage),
                height: "100%",
                transition: "width 0.3s"
              }}
            />
          </div>
        </div>

        {/* Topic-wise */}
        {Object.entries(topicSummary).map(([topic, data]) => {
          const pct = data.total ? Math.round((data.correct / data.total) * 100) : 0;
          return (
            <div key={topic} style={{ marginBottom: "1.5rem" }}>
              <strong>{topic}: {data.correct}/{data.total} ({pct}%)</strong>
              <div
                style={{
                  height: "12px",
                  width: "100%",
                  backgroundColor: "#e0e0e0",
                  borderRadius: "4px",
                  overflow: "hidden",
                  marginTop: "0.25rem"
                }}
              >
                <div
                  style={{
                    width: `${pct}%`,
                    backgroundColor: getPercentageColor(pct),
                    height: "100%",
                    transition: "width 0.3s"
                  }}
                />
              </div>
            </div>
          );
        })}

        {/* Wrong questions */}
        {wrongQuestions.length > 0 && (
          <div style={{ marginTop: "2rem" }}>
            <h2>Questions Answered Incorrectly</h2>
            {wrongQuestions.map((q, idx) => (
              <div key={q.id} style={{ marginBottom: "1.5rem", padding: "1rem", backgroundColor: "#fff3cd", borderRadius: "6px" }}>
                <p><strong>Q: </strong>{q.question}</p>
                <p><strong>Your Answer:</strong> {answers[q.id]}</p>
                <p><strong>Correct Answer:</strong> {q.answer}</p>
                {q.explanation && (
                  <p><strong>Explanation:</strong> {q.explanation}</p>
                )}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleNewSession}
          style={{
            marginTop: "2rem",
            padding: "0.75rem 2rem",
            fontSize: "1rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Begin New Session
        </button>
      </div>
    );
  }

  // Current question view
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const isAnswered = !!currentAnswer;
  const isCorrect = currentAnswer === currentQuestion?.answer;

  const currentPercentage = totalAnswered ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Bar Prep Practice</h1>

      {/* Progress */}
      <div style={{ marginBottom: "1rem" }}>
        <strong>Correct: {totalCorrect}/{totalAnswered}</strong>
        <div
          style={{
            height: "16px",
            width: "100%",
            backgroundColor: "#e0e0e0",
            borderRadius: "4px",
            overflow: "hidden",
            marginTop: "0.25rem"
          }}
        >
          <div
            style={{
              width: `${currentPercentage}%`,
              backgroundColor: getPercentageColor(currentPercentage),
              height: "100%",
              transition: "width 0.3s"
            }}
          />
        </div>
      </div>

      {/* Question */}
      {currentQuestion && (
        <div style={{ padding: "1rem", backgroundColor: "white", borderRadius: "6px", border: "1px solid #ccc" }}>
          <p style={{ fontSize: "1.1rem" }}><strong>Q: </strong>{currentQuestion.question}</p>

          <div style={{ marginTop: "0.5rem" }}>
            {currentQuestion.choices.map((choice, idx) => {
              let bg = "white";
              let border = "#ccc";
              if (isAnswered) {
                if (choice === currentQuestion.answer) {
                  bg = "#d4edda"; border = "#28a745";
                } else if (choice === currentAnswer) {
                  bg = "#f8d7da"; border = "#dc3545";
                }
              }

              return (
                <div
                  key={idx}
                  onClick={() => handleChoiceSelect(choice)}
                  style={{
                    padding: "0.75rem",
                    marginBottom: "0.5rem",
                    border: `2px solid ${border}`,
                    borderRadius: "6px",
                    backgroundColor: bg,
                    cursor: isAnswered ? "default" : "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  <input
                    type="radio"
                    checked={currentAnswer === choice}
                    readOnly
                    style={{ marginRight: "0.5rem" }}
                  />
                  {choice}
                  {isAnswered && choice === currentQuestion.answer && " ✓"}
                  {isAnswered && choice === currentAnswer && choice !== currentQuestion.answer && " ✗"}
                </div>
              );
            })}
          </div>

          {isAnswered && currentQuestion.explanation && (
            <p style={{ marginTop: "0.5rem", backgroundColor: "#fff3cd", padding: "0.5rem", borderRadius: "4px" }}>
              <strong>Explanation:</strong> {currentQuestion.explanation}
            </p>
          )}

          <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
            <button
              onClick={handleExitSession}
              style={{
                padding: "0.5rem 1.5rem",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Exit Session
            </button>
            {isAnswered && (
              <button
                onClick={handleNext}
                style={{
                  padding: "0.5rem 1.5rem",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                {currentIndex + 1 >= questions.length ? "Finish Session" : "Next Question"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
