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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

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
    if (answers[questionId]) return; // prevent changing after selection
    setAnswers((prev) => ({ ...prev, [questionId]: choice }));
  };

  const handleSubmitQuiz = () => {
    if (Object.keys(answers).length < questions.length) {
      alert("Please answer all questions before submitting");
      return;
    }
    setSubmitted(true);
  };

  const handleResetQuiz = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.answer) correct++;
    });
    return { correct, total: questions.length };
  };

  if (loading) return <div style={{ padding: "2rem" }}>Loading questions...</div>;
  if (error) return <div style={{ padding: "2rem", color: "red" }}>Error: {error}</div>;

  const score = submitted ? calculateScore() : null;

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Questions</h1>

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
                ? isCorrect
                  ? "2px solid #28a745"
                  : "2px solid #dc3545"
                : "1px solid #ccc",
              borderRadius: "8px",
            }}
          >
            <div style={{ marginBottom: "1rem" }}>
              <h3>
                Question {index + 1}
                {q.topic && <span style={{ color: "#666", fontSize: "0.9rem" }}> - {q.topic}</span>}
              </h3>
              <p style={{ fontSize: "1.1rem" }}>{q.question}</p>
            </div>

            <div>
              {q.choices.map((choice, choiceIndex) => {
                const isSelected = answers[q.id] === choice;
                const isCorrectAnswer = choice === q.answer;
                let backgroundColor = "white";
                let borderColor = "#ccc";

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
                  <button
                    key={choiceIndex}
                    disabled={hasAnswered}
                    onClick={() => handleChoiceSelect(q.id, choice)}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "0.5rem",
                      marginBottom: "0.5rem",
                      textAlign: "left",
                      backgroundColor,
                      border: `1px solid ${borderColor}`,
                      borderRadius: "4px",
                      cursor: hasAnswered ? "default" : "pointer",
                    }}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>

            {hasAnswered && q.explanation && (
              <div style={{ marginTop: "0.5rem", color: "#555" }}>
                Explanation: {q.explanation}
              </div>
            )}
          </div>
        );
      })}

      {questions.length > 0 && !submitted && (
        <button
          onClick={handleSubmitQuiz}
          style={{ padding: "0.5rem 1rem", marginRight: "0.5rem" }}
        >
          Submit Quiz
        </button>
      )}

      {submitted && score && (
        <div style={{ marginTop: "1rem", fontWeight: "bold" }}>
          You scored {score.correct} out of {score.total}
          <button onClick={handleResetQuiz} style={{ marginLeft: "1rem", padding: "0.25rem 0.5rem" }}>
            Reset Quiz
          </button>
        </div>
      )}
    </div>
  );
}

