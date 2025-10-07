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
  correct: number;
  answered: number;
};

export default function Questions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, string>>({});
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
          (q: any): q is Question =>
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
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [client]);

  if (loading) return <div style={{ padding: "1rem" }}>Loading questions...</div>;
  if (error) return <div style={{ padding: "1rem", color: "red" }}>{error}</div>;
  if (questions.length === 0) return <div style={{ padding: "1rem" }}>No questions available.</div>;

  const currentQuestion = questions[currentIndex];
  const isAnswered = currentAnswer !== null;

  const handleChoiceSelect = (choice: string) => {
    if (isAnswered) return;
    setCurrentAnswer(choice);
    setAnsweredQuestions(prev => ({ ...prev, [currentQuestion.id]: choice }));
  };

  const handleNext = () => {
    setCurrentAnswer(null);
    if (currentIndex + 1 >= questions.length) {
      setSessionFinished(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleExitSession = () => setSessionFinished(true);
  const handleNewSession = () => {
    setCurrentIndex(0);
    setCurrentAnswer(null);
    setAnsweredQuestions({});
    setSessionFinished(false);
  };

  const totalAnswered = Object.keys(answeredQuestions).length;
  const totalCorrect = Object.entries(answeredQuestions).filter(
    ([qid, ans]) => questions.find(q => q.id === qid)?.answer === ans
  ).length;
  const overallPercent = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const topicStats: Record<string, TopicStats> = {};
  Object.entries(answeredQuestions).forEach(([qid, ans]) => {
    const q = questions.find(q => q.id === qid);
    if (!q) return;
    const topic = q.topic || "Misc";
    if (!topicStats[topic]) topicStats[topic] = { correct: 0, answered: 0 };
    topicStats[topic].answered += 1;
    if (ans === q.answer) topicStats[topic].correct += 1;
  });

  const wrongQuestions = Object.entries(answeredQuestions)
    .filter(([qid, ans]) => {
      const q = questions.find(q => q.id === qid);
      return q && ans !== q.answer;
    })
    .map(([qid]) => questions.find(q => q.id === qid)!);

  const getColor = (percent: number) => {
    if (percent < 50) return "#dc3545";
    if (percent < 75) return "#ffc107";
    return "#28a745";
  };

  if (sessionFinished) {
    return (
      <div style={{ padding: "1rem", maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "1.5rem" }}>Session Summary</h1>

        <div style={{ marginBottom: "1rem" }}>
          <h3 style={{ fontSize: "1rem" }}>Overall</h3>
          <p style={{ fontSize: "0.85rem" }}>Correct: {totalCorrect}/{totalAnswered} ({overallPercent}%)</p>
          <div style={{ backgroundColor: "#eee", borderRadius: "4px", height: "12px", width: "100%" }}>
            <div
              style={{
                width: `${overallPercent}%`,
                backgroundColor: getColor(overallPercent),
                height: "100%",
                borderRadius: "4px"
              }}
            />
          </div>
        </div>

        {Object.entries(topicStats).map(([topic, stats]) => {
          const percent = Math.round((stats.correct / stats.answered) * 100);
          return (
            <div key={topic} style={{ marginBottom: "0.75rem" }}>
              <h4 style={{ fontSize: "0.9rem" }}>{topic}</h4>
              <p style={{ fontSize: "0.8rem" }}>Correct: {stats.correct}/{stats.answered} ({percent}%)</p>
              <div style={{ backgroundColor: "#eee", borderRadius: "4px", height: "8px", width: "100%" }}>
                <div
                  style={{
                    width: `${percent}%`,
                    backgroundColor: getColor(percent),
                    height: "100%",
                    borderRadius: "4px"
                  }}
                />
              </div>
            </div>
          );
        })}

        {wrongQuestions.length > 0 && (
          <div style={{ marginTop: "1rem" }}>
            <h3 style={{ fontSize: "1rem" }}>Incorrect Answers</h3>
            {wrongQuestions.map(q => {
              const userAns = answeredQuestions[q.id];
              return (
                <div key={q.id} style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px", marginBottom: "0.5rem" }}>
                  <p style={{ margin: "0.25rem 0" }}><strong>Q:</strong> {q.question}</p>
                  <p style={{ margin: "0.25rem 0" }}><strong>Your answer:</strong> {userAns}</p>
                  <p style={{ margin: "0.25rem 0" }}><strong>Correct answer:</strong> {q.answer}</p>
                  {q.explanation && <p style={{ margin: "0.25rem 0" }}><strong>Explanation:</strong> {q.explanation}</p>}
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={handleNewSession}
          style={{ marginTop: "1rem", padding: "0.5rem 1.5rem", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          Begin New Session
        </button>
      </div>
    );
  }

  // Session view (all on one page)
  return (
    <div style={{
      padding: "1rem",
      maxWidth: "800px",
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      justifyContent: "space-between",
      fontSize: "0.9rem"
    }}>
      {/* Stats */}
      <div>
        <p style={{ marginBottom: "0.25rem" }}>Correct: {totalCorrect}/{totalAnswered}</p>
        <div style={{ backgroundColor: "#eee", borderRadius: "4px", height: "10px", marginBottom: "0.5rem" }}>
          <div
            style={{
              width: totalAnswered > 0 ? `${Math.round((totalCorrect / totalAnswered) * 100)}%` : "0%",
              height: "100%",
              borderRadius: "4px",
              backgroundColor: getColor(totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0)
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div style={{ flex: "1 1 auto", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <p style={{ marginBottom: "0.5rem" }}><strong>Q:</strong> {currentQuestion.question}</p>
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
    </div>
  );
}


