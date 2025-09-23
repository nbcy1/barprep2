import { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';

const client = generateClient();

export default function AdminQuestions() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    choices: '',
    answer: '',
    topic: ''
  });

  // Fetch questions
  const fetchQuestions = async () => {
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
      console.error('Error fetching questions:', err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Add new question
  const handleAdd = async () => {
    if (!newQuestion.question || !newQuestion.choices || !newQuestion.answer) return;

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
            choices: JSON.stringify(newQuestion.choices.split(',')),
            answer: newQuestion.answer,
            topic: newQuestion.topic,
          },
        },
      });

      setNewQuestion({ question: '', choices: '', answer: '', topic: '' });
      fetchQuestions();
    } catch (err) {
      console.error('Error adding question:', err);
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
      console.error('Error deleting question:', err);
    }
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
      />
      <input
        type="text"
        placeholder="Choices (comma-separated)"
        value={newQuestion.choices}
        onChange={e => setNewQuestion({ ...newQuestion, choices: e.target.value })}
      />
      <input
        type="text"
        placeholder="Answer"
        value={newQuestion.answer}
        onChange={e => setNewQuestion({ ...newQuestion, answer: e.target.value })}
      />
      <input
        type="text"
        placeholder="Topic"
        value={newQuestion.topic}
        onChange={e => setNewQuestion({ ...newQuestion, topic: e.target.value })}
      />
      <button onClick={handleAdd}>Add Question</button>

      <h2>Existing Questions</h2>
      {questions.map(q => (
        <div key={q.id}>
          <p><strong>{q.question}</strong></p>
          <p>Choices: {JSON.parse(q.choices).join(', ')}</p>
          <p>Answer: {q.answer}</p>
          <p>Topic: {q.topic}</p>
          <button onClick={() => handleDelete(q.id)} style={{ color: 'red' }}>
            Delete
          </button>
          <hr />
        </div>
      ))}
    </div>
  );
}
