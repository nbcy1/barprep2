// src/pages/AdminQuestions.tsx
import { useEffect, useState } from "react";
import { DataStore } from "aws-amplify/datastore"; // ✅ Amplify v6 import
import { Question } from "../models"; // Your generated model

export default function AdminQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    choices: "",
    answer: "",
    topic: ""
  });

  // Fetch questions from DataStore
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const qs = await DataStore.query(Question);
        setQuestions(qs);
      } catch (err) {
        console.error("Error fetching questions:", err);
      }
    };
    fetchQuestions();

    // Subscribe for live updates
    const subscription = DataStore.observe(Question).subscribe(() => {
      fetchQuestions();
    });

    return () => subscription.unsubscribe();
  }, []);

  // Add new question
  const handleAdd = async () => {
    if (!newQuestion.question || !newQuestion.choices || !newQuestion.answer) return;

    try {
      await DataStore.save(
        new Question({
          question: newQuestion.question,
          choices: JSON.stringify(newQuestion.choices.split(",")), // comma-separated
          answer: newQuestion.answer,
          topic: newQuestion.topic
        })
      );
      setNewQuestion({ question: "", choices: "", answer: "", topic: "" });
    } catch (err) {
      console.error("Error saving question:", err);
    }
  };

  // Delete question
  const handleDelete = async (q: Question) => {
    try {
      await DataStore.delete(q);
      setQuestions(prev => prev.filter(item => item.id !== q.id));
    } catch (err) {
      console.error("Error deleting question:", err);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Admin Questions</h1>

      <h2>Add New Question</h2>
      <input
        type="text"
        placeholder="Question"
        value={newQuestion.question}
        onChange={e => setNewQuestion({ ...newQuestion, question: e.target.value })}
        style={{ display: "block", marginBottom: "0.5rem", width: "400px" }}
      />
      <input
        type="text"
        placeholder="Choices (comma-separated)"
        value={newQuestion.choices}
        onChange={e => setNewQuestion({ ...newQuestion, choices: e.target.value })}
        style={{ display: "block", marginBottom: "0.5rem", width: "400px" }}
      />
      <input
        type="text"
        placeholder="Answer"
        value={newQuestion.answer}
        onChange={e => setNewQuestion({ ...newQuestion, answer: e.target.value })}
        style={{ display: "block", marginBottom: "0.5rem", width: "400px" }}
      />
      <input
        type="text"
        placeholder="Topic"
        value={newQuestion.topic}
        onChange={e => setNewQuestion({ ...newQuestion, topic: e.target.value })}
        style={{ display: "block", marginBottom: "0.5rem", width: "400px" }}
      />
      <button onClick={handleAdd}>Add Question</button>

      <h2 style={{ marginTop: "2rem" }}>Existing Questions</h2>
      {questions.map(q => (
        <div key={q.id} style={{ marginBottom: "1rem" }}>
          <p>
            <strong>{q.question}</strong>
          </p>
          <p>Choices: {q.choices ? JSON.parse(q.choices).join(", ") : "N/A"}</p>
          <p>Answer: {q.answer}</p>
          <p>Topic: {q.topic}</p>
          <button onClick={() => handleDelete(q)} style={{ color: "red" }}>
            Delete
          </button>
          <hr />
        </div>
      ))}
    </div>
  );
}
