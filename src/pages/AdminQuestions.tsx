// src/pages/AdminQuestions.tsx
import { useEffect, useState } from 'react';
import { generateClient } from '@aws-amplify/data';
import type { Schema } from '../../amplify/data/resource'; // adjust relative path
import { Amplify } from 'aws-amplify';
import amplifyConfig from '../amplify_outputs.json'; // relative to src

// Configure Amplify
Amplify.configure(amplifyConfig);

// Create Data client
const client = generateClient<Schema>();

type QuestionType = {
  id?: string;
  question: string;
  choices: string[];
  answer: string;
  topic: string;
};

export default function AdminQuestions() {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [newQuestion, setNewQuestion] = useState<QuestionType>({
    question: '',
    choices: ['', '', ''],
    answer: '',
    topic: '',
  });

  async function fetchQuestions() {
    const qList = await client.models.Question.query();
    setQuestions(
      qList.map((q) => ({
        id: q.id,
        question: q.question,
        choices: JSON.parse(q.choices),
        answer: q.answer,
        topic: q.topic,
      }))
    );
  }

  useEffect(() => {
    fetchQuestions();
  }, []);

  async function addQuestion() {
    if (!newQuestion.question || !newQuestion.answer) return;

    const created = await client.models.Question.create({
      question: newQuestion.question,
      choices: JSON.stringify(newQuestion.choices),
      answer: newQuestion.answer,
      topic: newQuestion.topic,
    });

    setQuestions([
      ...questions,
      {
        id: created.id,
        question: created.question,
        choices: JSON.parse(created.choices),
        answer: created.answer,
        topic: created.topic,
      },
    ]);

    setNewQuestion({ question: '', choices: ['', '', ''], answer: '', topic: '' });
  }

  async function deleteQuestion(id?: string) {
    if (!id) return;
    await client.models.Question.delete({ id });
    setQuestions(questions.filter((q) => q.id !== id));
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Admin: Manage Questions</h2>

      <div style={{ marginBottom: '2rem', border: '1px solid #ccc', padding: '1rem' }}>
        <h3>Add New Question</h3>
        <input
          type="text"
          placeholder="Question"
          value={newQuestion.question}
          onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
          style={{ display: 'block', marginBottom: '0.5rem', width: '100%' }}
        />
        {newQuestion.choices.map((choice, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`Choice ${idx + 1}`}
            value={choice}
            onChange={(e) => {
              const newChoices = [...newQuestion.choices];
              newChoices[idx] = e.target.value;
              setNewQuestion({ ...newQuestion, choices: newChoices });
            }}
            style={{ display: 'block', marginBottom: '0.5rem', width: '100%' }}
          />
        ))}
        <input
          type="text"
          placeholder="Correct Answer"
          value={newQuestion.answer}
          onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
          style={{ display: 'block', marginBottom: '0.5rem', width: '100%' }}
        />
        <input
          type="text"
          placeholder="Topic"
          value={newQuestion.topic}
          onChange={(e) => setNewQuestion({ ...newQuestion, topic: e.target.value })}
          style={{ display: 'block', marginBottom: '0.5rem', width: '100%' }}
        />
        <button onClick={addQuestion}>Add Question</button>
      </div>

      <div>
        <h3>Existing Questions</h3>
        {questions.map((q) => (
          <div key={q.id} style={{ border: '1px solid #ddd', padding: '0.5rem', marginBottom: '0.5rem' }}>
            <strong>{q.question}</strong> <em>({q.topic})</em>
            <ul>
              {q.choices.map((c, idx) => (
                <li key={idx}>{c}</li>
              ))}
            </ul>
            <p>Answer: {q.answer}</p>
            <button onClick={() => deleteQuestion(q.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
