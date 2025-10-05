import React, { useEffect, useState } from 'react';
import { API } from '@aws-amplify/api';
import { Amplify } from 'aws-amplify';
import awsExports from '../aws-exports';
import { listQuestions as listQuestionsQuery } from '../graphql/queries';

Amplify.configure(awsExports);

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
          query: listQuestionsQuery,
          variables: { limit: 100 },
        });

        // result structure: result.data.listQuestions.items
        if (result.data?.listQuestions?.items) {
          setQuestions(result.data.listQuestions.items);
        } else {
          setQuestions([]);
        }
      } catch (err: any) {
        console.error('Error fetching questions:', err);
        setError(err.message || 'Error fetching questions');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) return <div>Loading questions...</div>;
  if (error) return <div>Error: {error}</div>;
  if (questions.length === 0) return <div>No questions found.</div>;

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
            <p>Answer: {q.answer}</p>
            {q.explanation && <p>Explanation: {q.explanation}</p>}
            {q.topic && <p>Topic: {q.topic}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Questions;
