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

export default function AdminQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    question: "",
    choices: ["", "", "", ""],
    answer: "",
    topic: "",
    explanation: "",
  });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

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

  // Add new question
  const handleAdd = async () => {
    if (!newQuestion.question || !newQuestion.answer) {
      alert("Question and answer are required");
      return;
    }
    try {
      const result = await client.graphql({
        query: `
          mutation CreateQuestion($input: CreateQuestionInput!) {
            createQuestion(input: $input) {
              id
              question
              choices
              answer
              explanation
              topic
            }
          }
        `,
        variables: { input: newQuestion },
      });
      setQuestions([...questions, result.data.createQuestion]);
      setNewQuestion({
        question: "",
        choices: ["", "", "", ""],
        answer: "",
        topic: "",
        explanation: "",
      });
    } catch (err) {
      console.error("Error adding question:", err);
      alert("Failed to add question");
    }
  };

  // Update question
  const handleUpdate = async () => {
    if (!editingQuestion) return;
    try {
      const result = await client.graphql({
        query: `
          mutation UpdateQuestion($input: UpdateQuestionInput!) {
            updateQuestion(input: $input) {
              id
              question
              choices
              answer
              explanation
              topic
            }
          }
        `,
        variables: { input: editingQuestion },
      });
      setQuestions(
        questions.map((q) => (q.id === editingQuestion.id ? result.data.updateQuestion : q))
      );
      setEditingQuestion(null);
    } catch (err) {
      console.error("Error updating question:", err);
      alert("Failed to update question");
    }
  };

  // Delete question
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    try {
      await client.graphql({
        query: `
          mutation DeleteQuestion($input: DeleteQuestionInput!) {
            deleteQuestion(input: $input) {
              id
            }
          }
        `,
        variables: { input: { id } },
      });
      setQuestions(questions.filter((q) => q.id !== id));
    } catch (err) {
      console.error("Error deleting question:", err);
      alert("Failed to delete question");
    }
  };

  // Handle quiz answer selection
  const handleChoiceSelect = (questionId: string, choice: string) => {
    if (answers[questionId]) return;
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
      <h1>Admin Questions</h1>

      {/* Add / Edit Form */}
      <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
        <h2>{editingQuestion ? "Edit Question" : "Add New Question"}</h2>
        <input
          type="text"
          placeholder="Question"
          value={editingQuestion?.question ?? newQuestion.question}
          onChange={(e) =>
            editingQuestion
              ? setEditingQuestion({ ...editingQuestion, question: e.target.value })
              : setNewQuestion({ ...newQuestion, question: e.target.value })
          }
          style={{ width: "100%", marginBottom: "0.5rem" }}
        />
        {Array.from({ length: 4 }).map((_, i) => (
          <input
            key={i}
            type="text"
            placeholder={`Choice ${i + 1}`}
            value={
              editingQuestion?.choices[i] ??
              newQuestion.choices?.[i] ??
              ""
            }
            onChange={(e) => {
              const updatedChoices = editingQuestion
                ? [...(editingQuestion.choices ?? [])]
                : [...(newQuestion.choices ?? ["", "", "", ""])];
              updatedChoices[i] = e.target.value;
              editingQuestion
                ? setEditingQuestion({ ...editingQuestion, choices: updatedChoices })
                : setNewQuestion({ ...newQuestion, choices: updatedChoices });
            }}
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />
        ))}
        <input
          type="text"
          placeholder="Answer"
          value={editingQuestion?.answer ?? newQuestion.answer}
          onChange={(e) =>
            editingQuestion
              ? setEditingQuestion({ ...editingQuestion, answer: e.target.value })
              : setNewQuestion({ ...newQuestion, answer: e.target.value })
          }
          style={{ width: "100%", marginBottom: "0.5rem" }}
        />
        <input
          type="text"
          placeholder="Topic"
          value={editingQuestion?.topic ?? newQuestion.topic}
          onChange={(e) =>
            editingQuestion
              ? setEditingQuestion({ ...editingQuestion, topic: e.target.value })
              : setNewQuestion({ ...newQuestion, topic: e.target.value })
          }
          style={{ width: "100%", marginBottom: "0.5rem" }}
        />
        <input
          type="text"
          placeholder="Explanation"
          value={editingQuestion?.explanation ?? newQuestion.explanation}
          onChange={(e) =>
            editingQuestion
              ? setEditingQuestion({ ...editingQuestion, explanation: e.target.value })
              : setNewQuestion({ ...newQuestion, explanation: e.target.value })
          }
          style={{ width: "100%", marginBottom: "0.5rem" }}
        />
        <button
          onClick={editingQuestion ? handleUpdate : handleAdd}
          style={{ padding: "0.5rem 1rem", marginRight: "0.5rem" }}
        >
          {editingQuestion ? "Update Question" : "Add Question"}
        </button>
        {editingQuestion && (
          <button
            onClick={() => setEditingQuestion(null)}
            style={{ padding: "0.5rem 1rem" }}
          >
            Cancel
          </button>
        )}
      </div>

      {/* Question List */}
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

            {/* Admin actions */}
            <div style={{ marginTop: "1rem" }}>
              <button
                onClick={() => setEditingQuestion(q)}
                style={{ marginRight: "0.5rem", padding: "0.25rem 0.5rem" }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(q.id)}
                style={{ padding: "0.25rem 0.5rem" }}
              >
                Delete
              </button>
            </div>
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
