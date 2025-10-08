import { useEffect, useState, useMemo, useCallback } from "react";
import { generateClient } from "aws-amplify/api";
import { getCurrentUser, fetchAuthSession } from "aws-amplify/auth";

export default function AdminQuestions() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    choices: ["", "", "", ""],
    answer: "",
    explanation: "",
    topic: ""
  });
  const [editQuestion, setEditQuestion] = useState({
    id: "",
    question: "",
    choices: ["", "", "", ""],
    answer: "",
    explanation: "",
    topic: ""
  });

  const client = useMemo(() => generateClient(), []);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        const session = await fetchAuthSession();
        
        console.log("=== AUTH DEBUG ===");
        console.log("User:", user);
        console.log("Groups in token:", session.tokens?.accessToken?.payload["cognito:groups"]);
        console.log("Full token payload:", session.tokens?.accessToken?.payload);
        console.log("=================");
        
        setIsAuthenticated(true);
        setUserEmail(user.signInDetails?.loginId || user.userId);
      } catch (error) {
        console.log("User not authenticated");
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
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
      console.log("Fetch result:", res);
      const items = res.data?.listQuestions?.items || [];
      const validQuestions = items.filter((q: any) => q !== null);
      setQuestions(validQuestions);
    } catch (err) {
      console.error("Error fetching questions:", err);
      console.error("Full error details:", JSON.stringify(err, null, 2));
    }
  }, [client]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchQuestions();
    }
  }, [fetchQuestions, isAuthenticated]);

  // Get unique topics from existing questions
  const existingTopics = useMemo(() => {
    const topics = new Set(questions.map(q => q.topic).filter(Boolean));
    return Array.from(topics).sort();
  }, [questions]);

  const handleChoiceChange = (index: number, value: string, isEditing: boolean = false) => {
    if (isEditing) {
      const updatedChoices = [...editQuestion.choices];
      updatedChoices[index] = value;
      setEditQuestion({ ...editQuestion, choices: updatedChoices });
    } else {
      const updatedChoices = [...newQuestion.choices];
      updatedChoices[index] = value;
      setNewQuestion({ ...newQuestion, choices: updatedChoices });
    }
  };

  const addChoice = (isEditing: boolean = false) => {
    if (isEditing) {
      setEditQuestion({ ...editQuestion, choices: [...editQuestion.choices, ""] });
    } else {
      setNewQuestion({ ...newQuestion, choices: [...newQuestion.choices, ""] });
    }
  };

  const removeChoice = (index: number, isEditing: boolean = false) => {
    const currentChoices = isEditing ? editQuestion.choices : newQuestion.choices;
    if (currentChoices.length <= 2) {
      alert("You must have at least 2 choices");
      return;
    }
    const updatedChoices = currentChoices.filter((_, i) => i !== index);
    if (isEditing) {
      setEditQuestion({ ...editQuestion, choices: updatedChoices });
    } else {
      setNewQuestion({ ...newQuestion, choices: updatedChoices });
    }
  };

  const handleAdd = async () => {
    if (!isAuthenticated) {
      alert("You must be signed in to add questions. Please sign in first.");
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

      if (newQuestion.explanation.trim()) {
        input.explanation = newQuestion.explanation;
      }

      console.log("Creating question with input:", input);

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
        variables: { input },
      });
      
      console.log("Question created successfully:", result);
      
      setNewQuestion({ question: "", choices: ["", "", "", ""], answer: "", explanation: "", topic: "" });
      fetchQuestions();
      alert("Question added successfully!");
    } catch (err: any) {
      console.error("Error adding question:", err);
      console.error("Full error details:", JSON.stringify(err, null, 2));
      
      if (err?.errors?.[0]?.errorType === "Unauthorized") {
        alert("Authorization Error: You don't have permission to create questions. Please ensure you're signed in with an account that has admin access.");
      } else {
        alert("Error adding question - check console for details");
      }
    }
  };

  const handleEdit = (question: any) => {
    setEditingId(question.id);
    setEditQuestion({
      id: question.id,
      question: question.question,
      choices: [...question.choices],
      answer: question.answer,
      explanation: question.explanation || "",
      topic: question.topic || ""
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditQuestion({
      id: "",
      question: "",
      choices: ["", "", "", ""],
      answer: "",
      explanation: "",
      topic: ""
    });
  };

  const handleSaveEdit = async () => {
    if (!isAuthenticated) {
      alert("You must be signed in to edit questions.");
      return;
    }

    if (!editQuestion.question || !editQuestion.answer || !editQuestion.topic) {
      alert("Please fill in question, answer, and topic");
      return;
    }

    const filledChoices = editQuestion.choices.filter(c => c.trim() !== "");
    if (filledChoices.length < 2) {
      alert("Please provide at least 2 choices");
      return;
    }

    if (!filledChoices.includes(editQuestion.answer)) {
      alert("The correct answer must be one of the choices");
      return;
    }

    try {
      const input: any = {
        id: editQuestion.id,
        question: editQuestion.question,
        choices: filledChoices,
        answer: editQuestion.answer,
        topic: editQuestion.topic,
      };

      if (editQuestion.explanation.trim()) {
        input.explanation = editQuestion.explanation;
      }

      await client.graphql({
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
        variables: { input },
      });

      alert("Question updated successfully!");
      setEditingId(null);
      fetchQuestions();
    } catch (err: any) {
      console.error("Error updating question:", err);
      console.error("Full error details:", JSON.stringify(err, null, 2));
      
      if (err?.errors?.[0]?.errorType === "Unauthorized") {
        alert("Authorization Error: You don't have permission to update questions.");
      } else {
        alert("Error updating question - check console for details");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAuthenticated) {
      alert("You must be signed in to delete questions.");
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
      alert("Question deleted successfully!");
    } catch (err: any) {
      console.error("Error deleting question:", err);
      console.error("Full error details:", JSON.stringify(err, null, 2));
      
      if (err?.errors?.[0]?.errorType === "Unauthorized") {
        alert("Authorization Error: You don't have permission to delete questions.");
      } else {
        alert("Error deleting question - check console for details");
      }
    }
  };

  if (isCheckingAuth) {
    return <div style={{ padding: "2rem" }}>Checking authentication...</div>;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Admin - Manage Questions</h1>
      
      {/* Authentication Status Banner */}
      <div style={{ 
        padding: "1rem", 
        marginBottom: "1.5rem", 
        borderRadius: "6px",
        backgroundColor: isAuthenticated ? "#d4edda" : "#fff3cd",
        border: `1px solid ${isAuthenticated ? "#c3e6cb" : "#ffeaa7"}`
      }}>
        {isAuthenticated ? (
          <div>
            <strong style={{ color: "#155724" }}>✓ Authenticated</strong>
            <p style={{ margin: "0.25rem 0 0 0", color: "#155724" }}>
              Signed in as: {userEmail}
            </p>
          </div>
        ) : (
          <div>
            <strong style={{ color: "#856404" }}>⚠ Not Authenticated</strong>
            <p style={{ margin: "0.25rem 0 0 0", color: "#856404" }}>
              You need to sign in to add or delete questions. Please sign in using the authentication page.
            </p>
          </div>
        )}
      </div>
      
      <div style={{ 
        backgroundColor: "#f5f5f5", 
        padding: "1.5rem", 
        borderRadius: "8px", 
        marginTop: "2rem",
        opacity: isAuthenticated ? 1 : 0.6,
        pointerEvents: isAuthenticated ? "auto" : "none"
      }}>
        <h2>Add New Question</h2>
        
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
            Question: <span style={{ color: "red" }}>*</span>
          </label>
          <textarea
            placeholder="Enter the question"
            value={newQuestion.question}
            onChange={e => setNewQuestion({ ...newQuestion, question: e.target.value })}
            style={{ width: "100%", padding: "0.5rem", minHeight: "80px" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
            Answer Choices: <span style={{ color: "red" }}>*</span>
          </label>
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
                <button 
                  onClick={() => removeChoice(index)}
                  style={{ padding: "0.5rem 1rem", backgroundColor: "#dc3545", color: "white", border: "none", cursor: "pointer", borderRadius: "4px" }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button 
            onClick={() => addChoice()}
            style={{ padding: "0.5rem 1rem", marginTop: "0.5rem", backgroundColor: "#28a745", color: "white", border: "none", cursor: "pointer", borderRadius: "4px" }}
          >
            + Add Another Choice
          </button>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
            Correct Answer: <span style={{ color: "red" }}>*</span>
          </label>
          <select
            value={newQuestion.answer}
            onChange={e => setNewQuestion({ ...newQuestion, answer: e.target.value })}
            style={{ width: "100%", padding: "0.5rem" }}
          >
            <option value="">Select the correct answer</option>
            {newQuestion.choices
              .filter(c => c.trim() !== "")
              .map((choice, index) => (
                <option key={index} value={choice}>
                  {choice}
                </option>
              ))}
          </select>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
            Explanation: <span style={{ color: "#666", fontSize: "0.9rem", fontWeight: "normal" }}>(optional)</span>
          </label>
          <textarea
            placeholder="Explain why this is the correct answer (optional but recommended)"
            value={newQuestion.explanation}
            onChange={e => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
            style={{ width: "100%", padding: "0.5rem", minHeight: "100px" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
            Topic: <span style={{ color: "red" }}>*</span>
          </label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <select
              value={newQuestion.topic}
              onChange={e => setNewQuestion({ ...newQuestion, topic: e.target.value })}
              style={{ flex: 1, padding: "0.5rem" }}
            >
              <option value="">Select or enter a topic</option>
              {existingTopics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
            <span style={{ padding: "0.5rem", color: "#666" }}>or</span>
            <input
              type="text"
              placeholder="Enter new topic"
              value={newQuestion.topic && !existingTopics.includes(newQuestion.topic) ? newQuestion.topic : ""}
              onChange={e => setNewQuestion({ ...newQuestion, topic: e.target.value })}
              style={{ flex: 1, padding: "0.5rem" }}
            />
          </div>
        </div>

        <button 
          onClick={handleAdd}
          disabled={!isAuthenticated}
          style={{ 
            padding: "0.75rem 2rem", 
            backgroundColor: isAuthenticated ? "#007bff" : "#ccc", 
            color: "white", 
            border: "none", 
            cursor: isAuthenticated ? "pointer" : "not-allowed", 
            fontSize: "1rem", 
            borderRadius: "6px" 
          }}
        >
          Add Question
        </button>
      </div>

      <div style={{ marginTop: "3rem" }}>
        <h2>Existing Questions ({questions.length})</h2>
        {questions.length === 0 ? (
          <p>No questions yet.</p>
        ) : (
          questions.map(q => (
            <div key={q.id} style={{ backgroundColor: "white", padding: "1.5rem", marginBottom: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
              {editingId === q.id ? (
                // Edit Mode
                <>
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Question:</label>
                    <textarea
                      value={editQuestion.question}
                      onChange={e => setEditQuestion({ ...editQuestion, question: e.target.value })}
                      style={{ width: "100%", padding: "0.5rem", minHeight: "80px" }}
                    />
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Choices:</label>
                    {editQuestion.choices.map((choice, index) => (
                      <div key={index} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                        <input
                          type="text"
                          value={choice}
                          onChange={e => handleChoiceChange(index, e.target.value, true)}
                          style={{ flex: 1, padding: "0.5rem" }}
                        />
                        {editQuestion.choices.length > 2 && (
                          <button 
                            onClick={() => removeChoice(index, true)}
                            style={{ padding: "0.5rem 1rem", backgroundColor: "#dc3545", color: "white", border: "none", cursor: "pointer", borderRadius: "4px" }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button 
                      onClick={() => addChoice(true)}
                      style={{ padding: "0.5rem 1rem", backgroundColor: "#28a745", color: "white", border: "none", cursor: "pointer", borderRadius: "4px" }}
                    >
                      + Add Choice
                    </button>
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Correct Answer:</label>
                    <select
                      value={editQuestion.answer}
                      onChange={e => setEditQuestion({ ...editQuestion, answer: e.target.value })}
                      style={{ width: "100%", padding: "0.5rem" }}
                    >
                      <option value="">Select the correct answer</option>
                      {editQuestion.choices
                        .filter(c => c.trim() !== "")
                        .map((choice, index) => (
                          <option key={index} value={choice}>
                            {choice}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Explanation:</label>
                    <textarea
                      value={editQuestion.explanation}
                      onChange={e => setEditQuestion({ ...editQuestion, explanation: e.target.value })}
                      style={{ width: "100%", padding: "0.5rem", minHeight: "100px" }}
                    />
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Topic:</label>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <select
                        value={editQuestion.topic}
                        onChange={e => setEditQuestion({ ...editQuestion, topic: e.target.value })}
                        style={{ flex: 1, padding: "0.5rem" }}
                      >
                        <option value="">Select or enter a topic</option>
                        {existingTopics.map(topic => (
                          <option key={topic} value={topic}>{topic}</option>
                        ))}
                      </select>
                      <span style={{ padding: "0.5rem", color: "#666" }}>or</span>
                      <input
                        type="text"
                        placeholder="Enter new topic"
                        value={editQuestion.topic && !existingTopics.includes(editQuestion.topic) ? editQuestion.topic : ""}
                        onChange={e => setEditQuestion({ ...editQuestion, topic: e.target.value })}
                        style={{ flex: 1, padding: "0.5rem" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "1rem" }}>
                    <button 
                      onClick={handleSaveEdit}
                      style={{ padding: "0.5rem 1rem", backgroundColor: "#28a745", color: "white", border: "none", cursor: "pointer", borderRadius: "4px" }}
                    >
                      Save Changes
                    </button>
                    <button 
                      onClick={handleCancelEdit}
                      style={{ padding: "0.5rem 1rem", backgroundColor: "#6c757d", color: "white", border: "none", cursor: "pointer", borderRadius: "4px" }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                // View Mode
                <>
                  <p style={{ fontWeight: "bold", fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                    {q.question}
                  </p>
                  <p style={{ color: "#666", marginBottom: "0.5rem" }}>
                    <strong>Topic:</strong> {q.topic}
                  </p>
                  <div style={{ marginBottom: "0.5rem" }}>
                    <strong>Choices:</strong>
                    <ul style={{ marginTop: "0.25rem", marginLeft: "1.5rem" }}>
                      {q.choices?.map((choice: string, idx: number) => (
                        <li 
                          key={idx}
                          style={{ 
                            color: choice === q.answer ? "#28a745" : "black",
                            fontWeight: choice === q.answer ? "bold" : "normal"
                          }}
                        >
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
                  <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                    <button 
                      onClick={() => handleEdit(q)}
                      disabled={!isAuthenticated}
                      style={{ 
                        padding: "0.5rem 1rem", 
                        backgroundColor: isAuthenticated ? "#007bff" : "#ccc", 
                        color: "white", 
                        border: "none", 
                        cursor: isAuthenticated ? "pointer" : "not-allowed", 
                        borderRadius: "4px" 
                      }}
                    >
                      Edit Question
                    </button>
                    <button 
                      onClick={() => handleDelete(q.id)}
                      disabled={!isAuthenticated}
                      style={{ 
                        padding: "0.5rem 1rem", 
                        backgroundColor: isAuthenticated ? "#dc3545" : "#ccc", 
                        color: "white", 
                        border: "none", 
                        cursor: isAuthenticated ? "pointer" : "not-allowed", 
                        borderRadius: "4px" 
                      }}
                    >
                      Delete Question
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
