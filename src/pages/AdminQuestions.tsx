import { useEffect, useState, useMemo, useCallback } from "react";
import { generateClient } from "aws-amplify/api";

export default function AdminQuestions() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    choices: "",
    topic: ""
  });

  // ✅ Create client once using useMemo
  const client = useMemo(() => generateClient(), []);

  // ✅ Wrap fetchQuestions in useCallback so it can be safely used in useEffect
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

  // Add new question
  const handleAdd = async () => {
    if (!newQuestion.question || !newQuestion.choices || !newQuestion.topic) return;
    try {
      await client.graphql({
        query: `
          mutation CreateQuestion($input: CreateQuestionInput!) {
            createQuestion(input: $input) {
              id
            }
          }
        `,
        variables: {
          input: {
            question: newQuestion.question,
            choices: JSON.stringify(newQuestion.choices.split(",")),
            topic: newQuestion.topic,
          },
        },
      });
      setNewQuestion({ question: "", choices: "", topic: "" });
      fetchQuestions();
    } catch (err) {
      console.error("Error adding question:", err);
    }
  };

  // Delete question
  const handleDelete = async (id: string) => {
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
    <div style={{ padding: "1rem" }}>
      <h1>Admin Questions</h1>
      
      <h2>Add New Question</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: "500px" }}>
        <input
          type="text"
          placeholder="Question"
          value={newQuestion.question}
          onChange={e => setNewQuestion({ ...newQuestion, question: e.target.value })}
          style={{ padding: "0.5rem" }}
        />
        <input
          type="text"
          placeholder="Choices (comma-separated)"
          value={newQuestion.choices}
          onChange={e => setNewQuestion({ ...newQuestion, choices: e.target.value })}
          style={{ padding: "0.5rem" }}
        />
        <input
          type="text"
          placeholder="Topic"
          value={newQuestion.topic}
          onChange={e => setNewQuestion({ ...newQuestion, topic: e.target.value })}
          style={{ padding: "0.5rem" }}
        />
        <button onClick={handleAdd} style={{ padding: "0.5rem 1rem" }}>
          Add Question
        </button>
      </div>

      <h2>Existing Questions</h2>
      {questions.length === 0 ? (
        <p>No questions yet.</p>
      ) : (
        questions.map(q => (
          <div key={q.id} style={{ marginBottom: "1rem", padding: "1rem", border: "1px solid #ccc" }}>
            <p><strong>{q.question}</strong></p>
            <p>Choices: {JSON.parse(q.choices).join(", ")}</p>
            <p>Topic: {q.topic}</p>
            <button 
              onClick={() => handleDelete(q.id)} 
              style={{ color: "white", backgroundColor: "red", padding: "0.5rem 1rem", border: "none", cursor: "pointer" }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}
