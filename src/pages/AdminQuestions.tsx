import { useEffect, useState, useMemo, useCallback } from "react";
import { generateClient } from "aws-amplify/api";
import * as Amplify from "aws-amplify"; // ✅ Import all for Vite
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
  const [isAdmin, setIsAdmin] = useState(false); // ✅ Admin status

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

  // ✅ Only render admin UI if user is in Admin group
  if (!isAdmin) {
    return <p style={{ padding: "2rem", textAlign: "center" }}>You do not have admin access.</p>;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Admin - Manage Questions</h1>
      {/* --- Add Question Form --- */}
      <div style={{ backgroundColor: "#f5f5f5", padding: "1.5rem", borderRadius: "8px", marginTop: "2rem" }}>
        <h2>Add New Question</h2>
        {/* Question, Choices, Answer, Explanation, Topic form fields (unchanged) */}
        {/* ...copy all your form JSX from previous component here */}
        <button
          onClick={handleAdd}
          style={{ padding: "0.75rem 2rem", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer", fontSize: "1rem", borderRadius: "6px" }}
        >
          Add Question
        </button>
      </div>

      {/* --- Existing Questions List --- */}
      <div style={{ marginTop: "3rem" }}>
        <h2>Existing Questions ({questions.length})</h2>
        {questions.length === 0 ? (
          <p>No questions yet.</p>
        ) : (
          questions.map(q => (
            <div key={q.id} style={{ backgroundColor: "white", padding: "1.5rem", marginBottom: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
              <p style={{ fontWeight: "bold", fontSize: "1.1rem", marginBottom: "0.5rem" }}>{q.question}</p>
              <p style={{ color: "#666", marginBottom: "0.5rem" }}><strong>Topic:</strong> {q.topic}</p>
              <div style={{ marginBottom: "0.5rem" }}>
                <strong>Choices:</strong>
                <ul style={{ marginTop: "0.25rem", marginLeft: "1.5rem" }}>
                  {q.choices?.map((choice: string, idx: number) => (
                    <li key={idx} style={{ color: choice === q.answer ? "#28a745" : "black", fontWeight: choice === q.answer ? "bold" : "normal" }}>
                      {choice} {choice === q.answer && "✓ (Correct)"}
                    </li>
                  ))}
                </ul>
              </div>
              {q.explanation && (
                <div style={{ marginTop: "0.75rem", padding: "0.75rem", backgroundColor: "#f8f9fa", borderRadius: "4px", borderLeft: "3px solid #007bff" }}>
                  <strong>Explanation:</strong>
                  <p style={{ margin: "0.5rem 0 0 0" }}>{q.explanation}</p>
                </div>
              )}
              <button
                onClick={() => handleDelete(q.id)}
                style={{ padding: "0.5rem 1rem", backgroundColor: "#dc3545", color: "white", border: "none", cursor: "pointer", marginTop: "1rem", borderRadius: "4px" }}
              >
                Delete Question
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

