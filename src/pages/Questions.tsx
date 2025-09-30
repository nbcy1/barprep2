import { useEffect, useState, useMemo } from "react";
import { generateClient } from "aws-amplify/api";

type Question = {
  id: string;
  question: string;
  choices: string[];
  topic?: string;
};

export default function Questions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Create client once using useMemo (more efficient)
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
  }, []); // ✅ Empty dependency array - client is stable now

  const handleChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    console.log("User answers:", answers);
    alert("Answers submitted!");
  };

  if (loading) return <div style={{ padding: "1rem" }}>Loading questions...</div>;
  if (error) return <div style={{ padding: "1rem", color: "red" }}>Error: {error}</div>;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Bar Prep Questions</h1>
      {questions.length === 0 ? (
        <p>No questions available yet.</p>
      ) : (
        questions.map((q) => (
          <div
            key={q.id}
            style={{ marginBottom: "1.5rem", border: "1px solid #ccc", padding: "1rem" }}
          >
            <h3>{q.question}</h3>
            {q.choices && <p>Choices: {q.choices.join(", ")}</p>}
            {q.topic && <p>Topic: {q.topic}</p>}
            <input
              type="text"
              placeholder="Your answer..."
              value={answers[q.id] || ""}
              onChange={(e) => handleChange(q.id, e.target.value)}
              style={{ marginTop: "0.5rem", width: "100%" }}
            />
          </div>
        ))
      )}
      {questions.length > 0 && (
        <button
          onClick={handleSubmit}
          style={{ padding: "0.5rem 1rem", fontSize: "1rem" }}
        >
          Submit Answers
        </button>
      )}
    </div>
  );
}
