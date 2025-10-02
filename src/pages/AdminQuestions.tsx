import { useEffect, useState, useMemo, useCallback } from "react";
import { generateClient } from "aws-amplify/api";
import * as Amplify from "aws-amplify";
import awsExports from "../aws-exports"; // adjust path if needed

// Configure Amplify (must happen before using Auth)
Amplify.default.configure(awsExports);
const { Auth } = Amplify;

export default function AdminQuestions() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    choices: ["", "", "", ""],
    answer: "",
    explanation: "",
    topic: ""
  });
  const [isAdmin, setIsAdmin] = useState(false);

  const client = useMemo(() => generateClient(), []);

  // ✅ Check if the current user is in the Admin group
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => {
        const groups = user.signInUserSession.accessToken.payload["cognito:groups"] || [];
        console.log("User Groups:", groups);
        setIsAdmin(groups.includes("Admin"));
      })
      .catch(err => {
        console.error("Error fetching user:", err);
        setIsAdmin(false);
      });
  }, []);

  const fetchQuestions = useCallback(async () => {
    try {
      const res = await client.graphql({
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
      setQuestions(res.data.listQuestions.items);
    } catch (err) {
      console.error("Error fetching questions:", err);
    }
  }, [client]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleChoiceChange = (index: number, value: string) => {
    const updatedChoices = [...newQuestion.choices];
    updatedChoices[index] = value;
    setNewQuestion({ ...newQuestion, choices: updatedChoices });
  };

  const addChoice = () => {
    setNewQuestion({ ...newQuestion, choices: [...newQuestion.choices, ""] });
  };

  const removeChoice = (index: number) => {
    if (newQuestion.choices.length <= 2) {
      alert("You must have at least 2 choices");
      return;
    }
    const updatedChoices = newQuestion.choices.filter((_, i) => i !== index);
    setNewQuestion({ ...newQuestion, choices: updatedChoices });
  };

  const handleAdd = async () => {
    if (!isAdmin) {
      alert("You do not have permission to add questions.");
      return;
    }

    if (!newQuestion.question || !newQuestion.answer || !newQuestion.topic) {
      alert("Please fill in question, answer, and topic");
      return;
    }

    const filledChoices = newQuestion.choices.filter(c => c.trim() !== "");
    if (filledChoices.length < 2) {
      alert("Please provide at least 2 choices");
      return;
    }

    if (!filledChoices.includes(newQuestion.answer)) {
      alert("The correct answer must be one of the choices");
      return;
    }

    try {
      const input: any = {
        question: newQuestion.question,
        choices: filledChoices,
        answer: newQuestion.answer,
        topic: newQuestion.topic,
      };
      if (newQuestion.explanation.trim()) input.explanation = newQuestion.explanation;

      await client.graphql({
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
        variables: { input },
      });

      setNewQuestion({ question: "", choices: ["", "", "", ""], answer: "", explanation: "", topic: "" });
      fetchQuestions();
      alert("Question added successfully!");
    } catch (err) {
      console.error("Error adding question:", err);
      alert("Error adding question");
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) {
      alert("You do not have permission to delete questions.");
      return;
    }

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
      setQuestions(prev => prev.filter(q => q.id !== id));
    } catch (err) {
      console.error("Error deleting question:", err);
      alert("Error deleting question");
    }
  };

  if (!isAdmin) {
    return <p style={{ padding: "2rem", textAlign: "center" }}>You do not have admin access.</p>;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Admin - Manage Questions</h1>

      {/* Add Question Form */}
      <div style={{ backgroundColor: "#f5f5f5", padding: "1.5rem", borderRadius: "8px", marginTop: "2rem" }}>
        <h2>Add New Question</h2>
        {/* Question Input */}
        <textarea
          placeholder="Enter the question"
          value={newQuestion.question}
          onChange={e => setNewQuestion({ ...newQuestion, question: e.target.value })}
          style={{ width: "100%", padding: "0.5rem", minHeight: "80px", marginBottom: "1rem" }}
        />
        {/* Choices */}
        {newQuestion.choices.map((choice, index) => (
          <div key={index} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <input
              type="text"
              placeholder={`Choice ${index + 1}`}
              value={choice}
              onChange={e => handleChoiceChange(index, e.target.value)}
              style={{ flex: 1, padding: "0.5rem" }}
            />
            {newQuestion.choices.length > 2 && (
              <button onClick={() => removeChoice(index)} style={{ padding: "0.5rem 1rem", backgroundColor: "#dc3545", color: "white", border: "none", cursor: "pointer", borderRadius: "4px" }}>
                Remove
              </button>
            )}
          </div>
        ))}
        <button onClick={addChoice} style={{ padding: "0.5rem 1rem", marginTop: "0.5rem", backgroundColor: "#28a745", color: "white", border: "none", cursor: "pointer", borderRadius: "4px" }}>
          + Add Another Choice
        </button>

        {/* Answer */}
        <select
          value={newQuestion.answer}
          onChange={e => setNewQuestion({ ...newQuestion, answer: e.target.value })}
          style={{ width: "100%", padding: "0.5rem", marginTop: "1rem", marginBottom: "1rem" }}
        >
          <option value="">Select the correct answer</option>
          {newQuestion.choices.filter(c => c.trim() !== "").map((choice, idx) => (
            <option key={idx} value={choice}>{choice}</option>
          ))}
        </select>

        {/* Explanation */}
        <textarea
          placeholder="Explanation (optional)"
          value={newQuestion.explanation}
          onChange={e => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
          style={{ width: "100%", padding: "0.5rem", minHeight: "80px", marginBottom: "1rem" }}
        />

        {/* Topic */}
        <input
          type="text"
          placeholder="Topic"
          value={newQuestion.topic}
          onChange={e => setNewQuestion({ ...newQuestion, topic: e.target.value })}
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        />

        <button onClick={handleAdd} style={{ padding: "0.75rem 2rem", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer", fontSize: "1rem", borderRadius: "6px" }}>
          Add Question
        </button>
      </div>

      {/* Existing Questions */}
      <div style={{ marginTop: "3rem" }}>
        <h2>Existing Questions ({questions.length})</h2>
        {questions.map(q => (
          <div key={q.id} style={{ backgroundColor: "white", padding: "1.5rem", marginBottom: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
            <p style={{ fontWeight: "bold" }}>{q.question}</p>
            <p><strong>Topic:</strong> {q.topic}</p>
            <ul>
              {q.choices.map((c: string, i: number) => (
                <li key={i} style={{ fontWeight: c === q.answer ? "bold" : "normal", color: c === q.answer ? "#28a745" : "black" }}>
                  {c} {c === q.answer && "✓"}
                </li>
              ))}
            </ul>
            {q.explanation && <p><strong>Explanation:</strong> {q.explanation}</p>}
            <button onClick={() => handleDelete(q.id)} style={{ padding: "0.5rem 1rem", backgroundColor: "#dc3545", color: "white", border: "none", cursor: "pointer", borderRadius: "4px" }}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

