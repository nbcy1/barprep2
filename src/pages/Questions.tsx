// src/pages/Questions.tsx
import { useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import { listQuestions } from '../graphql/queries';

type Question = {
  id: string;
  question: string;
  choices: string[];
  answer: string;
  topic?: string;
  createdAt: string;
  updatedAt: string;
};

export default function Questions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const result = await API.graphql({
          query: listQuestions
        });
        
        const questionsData = (result as any).data.listQuestions.items;
        setQuestions(questionsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    console.log('User answers:', answers);
    alert('Answers submitted!');
  };

  if (loading) {
    return <div style={{ padding: '1rem' }}>Loading questions...</div>;
  }

  if (error) {
    return <div style={{ padding: '1rem', color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Bar Prep Questions</h1>
      {questions.length === 0 ? (
        <p>No questions available yet.</p>
      ) : (
        questions.map(q => (
          <div key={q.id} style={{ marginBottom: '1.5rem', border: '1px solid #ccc', padding: '1rem' }}>
            <h3>{q.question}</h3>
            {q.topic && <small style={{ color: '#666' }}>Topic: {q.topic}</small>}
            <div style={{ marginTop: '0.5rem' }}>
              {q.choices.map((choice: string) => (
                <label key={choice} style={{ display: 'block', margin: '0.25rem 0' }}>
                  <input
                    type="radio"
                    name={q.id}
                    value={choice}
                    checked={answers[q.id] === choice}
                    onChange={e => handleChange(q.id, e.target.value)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  {choice}
                </label>
              ))}
            </div>
          </div>
        ))
      )}
      {questions.length > 0 && (
        <button onClick={handleSubmit} style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
          Submit Answers
        </button>
      )}
    </div>
  );
}
