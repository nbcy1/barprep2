import { useEffect, useState, useMemo, useCallback } from "react";
import { generateClient } from "aws-amplify/api";

export default function AdminQuestions() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    choices: ["", "", "", ""],
    answer: "",
    topic: ""
  });

  const client = useMemo(() => generateClient(), []);

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
      await client.graphql({
        query: `
          mutation CreateQuestion($input: CreateQuestionInput!) {
            createQuestion(input: $input) {
              id
              question
              choices
              answer
              topic
            }
          }
        `,
        variables: {
          input: {
            question: newQuestion.question,
            choices: filledChoices,
            answer: newQuestion.answer,
            topic: newQuestion.topic,
          },
        },
      });
      
      setNewQuestion({ question: "", choices: ["", "", "", ""], answer: "", topic: "" });
      fetchQuestions();
      alert("Question added successfully!");
    } catch (err) {
      console.error("Error adding question:", err);
      alert("Error adding question");
    }
  };

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
      setQuestions(prev => prev.filter(q => q.id !== id));
    } catch (err) {
      console.error("Error deleting question:", err);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Admin - Manage Questions</h1>
      
      <div style={{ backgroundColor: "#f5f5f5", padding: "1.5rem", borderRadius: "8px", marginTop: "2rem" }}>
        <h2>Add New Question</h2>
        
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
            Question:
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
            Answer Choices:
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
                  style={{ padding: "0.5rem 1rem", backgroundColor: "#dc3545", color: "white", border: "none", cursor: "pointer" }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button 
            onClick={addChoice}
            style={{ padding: "0.5rem 1rem", marginTop: "0.5rem", backgroundColor: "#28a745", color: "white", border: "none", cursor: "pointer" }}
          >
            + Add Another Choice
          </button>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
            Correct Answer:
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
            Topic:
          </label>
          <input
            type="text"
            placeholder="e.g., Constitutional Law, Contracts"
            value={newQuestion.topic}
            onChange={e => setNewQuestion({ ...newQuestion, topic: e.target.value })}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <button 
          onClick={handleAdd}
          style={{ padding: "0.75rem 2rem", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer", fontSize: "1rem" }}
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
              <button 
                onClick={() => handleDelete(q.id)} 
                style={{ padding: "0.5rem 1rem", backgroundColor: "#dc3545", color: "white", border: "none", cursor: "pointer" }}
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
