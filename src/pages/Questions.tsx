import React, { useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import { listQuestions } from '../graphql/queries'; // make sure this path matches your generated queries

interface Question {
  id: string;
  question: string;
  choices: string[];
  answer: string;
  explanation?: string;
  topic?: string;
}

const Questions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);

      try {
        const result: any = await API.graphql({
          query: listQuestions,
          variables: { limit: 100 }, // optional limit
        });

        // Safely handle null items
        const items: Question[] =
          result?.data?.listQuestions?.items ?? [];

        setQuestions(items);
      } catch (err: any) {
        console.error('Error fetching questions:', err);
        setError(err.message || 'Error fetching questions');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) return <p>Loading questions...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (questions.length === 0) return <p>No questions available.</p>;

  return (
    <div>
      <h1>Questions</h1>
      <ul>
        {questions.map((q) => (
          <li key={q.id}>
            <strong>{q.question}</strong>
            <ul>
              {q.choices.map((choice, idx) => (
                <li key={idx}>{choice}</li>
              ))}
            </ul>
            <p><em>Answer: {q.answer}</em></p>
            {q.explanation && <p>Explanation: {q.explanation}</p>}
            {q.topic && <p>Topic: {q.topic}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Questions;

