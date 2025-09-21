// src/pages/AdminQuestions.tsx
import { useEffect, useState } from 'react';
import { DataStore } from 'aws-amplify';
import { Question } from '../models'; // updated import

export default function AdminQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    choices: '',
    answer: '',
    topic: ''
  });

  // Fetch questions from DataStore
  useEffect(() => {
    const fetchQuestions = async () => {
      const qs = await DataStore.query(Question);
      setQuestions(qs);
    };
    fetchQuestions();
  }, []);

  // Add new question
  const handleAdd = async () => {
    if (!newQuestion.question || !newQuestion.choices || !newQuestion.answer) return;

    await DataStore.save(
      new Question({
        question: newQuestion.question,
        choices: JSON.stringify(newQuestion.choices.split(',')), // comma-separated
        answer: newQuestion.answer,
        topic: newQuestion.topic
      })
    );
    setNewQuestion({ question: '', choices: '', answer: '', topic: '' });
    const qs = await DataStore.query(Question);
    setQuestions(qs);
  };

  // Delete question
  const handleDelete = async (q: Question) => {
    await DataStore.delete(q);
    setQuestions(prev => prev.filter(item => item.id !== q.id));
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Admin Questions</h1>

      <h2>Add New Question</h2>
      <input
        type="text"
        placeholder="Question"
        value={newQuestion.question}
        onChange={e => setNewQuestion({ ...newQuestion, question: e.target.value })}
        style={{ display: 'block', marginBottom: '0.5rem', width: '400px' }}
      />
      <input
        type="text"
        placeholder="Choices (comma-separated)"
        value={newQuestion.choices}
        onChange={e => setNewQuestion({ ...newQuestion, choices: e.target.value })}
        style={{ display: 'block', marginBottom: '0.5rem', width: '400px' }}
      />
      <input
        type="text"
        placeholder="Answer"
        value={newQuestion.answer}
        onChange={e => setNewQuestion({ ...newQuestion, answer: e.target.value })}
        style={{ display: 'block', marginBottom: '0.5rem', width: '400px' }}
      />
      <input
        type="text"
        placeholder="Topic"
        value={newQuestion.topic}
        onChange={e => setNewQuestion({ ...newQuestion, topic: e.target.value })}
        style={{ display: 'block', marginBottom: '0.5rem', width: '400px' }}
      />
      <button onClick={handleAdd}>Add Question</button>

      <h2 style={{ marginTop: '2rem' }}>Existing Questions</h2>
      {questions.map(q => (
        <div key={q.id} style={{ marginBottom: '1rem' }}>
          <p><strong>{q.question}</strong></p>
          <p>Choices: {JSON.parse(q.choices).join(', ')}</p>
          <p>Answer: {q.answer}</p>
          <p>Topic: {q.topic}</p>
          <button onClick={() => handleDelete(q)} style={{ color: 'red' }}>Delete</button>
          <hr />
        </div>
      ))}
    </div>
  );
}
