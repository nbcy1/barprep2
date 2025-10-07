import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';

const client = generateClient();

interface QuizHistory {
  id: string;
  topic?: string;
  total?: number;
  score?: number;
  answers?: any;
  createdAt?: string;
}

const History: React.FC = () => {
  const [history, setHistory] = useState<QuizHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await client.graphql({
          query: `
            query ListQuizHistories {
              listQuizHistories(limit: 50) {
                items {
                  id
                  topic
                  total
                  score
                  createdAt
                }
              }
            }
          `,
          authMode: 'userPool', // ensures logged-in user's auth
        });

        const items = response.data?.listQuizHistories?.items || [];
        setHistory(items);
      } catch (err: any) {
        console.error("Error fetching quiz results:", err);
        setError("Failed to load quiz history.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) return <p>Loading quiz history...</p>;
  if (error) return <p>{error}</p>;
  if (history.length === 0) return <p>No quiz history found.</p>;

  return (
    <div className="history-page">
      <h1>Quiz History</h1>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Topic</th>
            <th>Score</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item) => (
            <tr key={item.id}>
              <td>{item.createdAt ? new Date(item.createdAt).toLocaleString() : "N/A"}</td>
              <td>{item.topic || "N/A"}</td>
              <td>{item.score ?? "-"}</td>
              <td>{item.total ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;
