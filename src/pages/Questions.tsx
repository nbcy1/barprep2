// src/pages/Questions.tsx
import { useEffect, useState } from 'react';
import { DataStore } from 'aws-amplify';
import { Question } from '../amplify/models';

export default function Questions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchQuestions = async () => {
      const qs = await DataStore.query(Question);
      setQuestions(qs);
    };
    fetchQuestions();
  }, []);

  const handleChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    console.log('User answers:', answers);
    alert('Answers submitted!');
    // Later, we can save these to backend if needed
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Questions</h1>
      {questions.map(q => (
        <div key={q.id} style={{ marginBottom: '1.5rem' }}>
          <p>{q.question}</p>
          {JSON.parse(q.choices).map((choice: string) => (
            <label key={choice} style={{ display: 'block' }}>
              <input
                type="radio"
                name={q.id}
                value={choice}
                checked={answers[q.id] === choice}
                onChange={e => handleChange(q.id, e.target.value)}
              />
              {choice}
            </label>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit}>Submit Answers</button>
    </div>
  );
}

