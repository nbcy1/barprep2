"use client";

import React, { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/api";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Link } from "react-router-dom";

interface QuizHistory {
  id: string;
  score?: number;
  total?: number;
  answers?: any;
  createdAt?: string;
}

export default function History() {
  const [quizResults, setQuizResults] = useState<QuizHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthenticator((ctx) => [ctx.user]);
  const client = generateClient();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await client.graphql({
          query: `
            query ListQuizHistories {
              listQuizHistories(limit: 100) {
                items {
                  id
                  score
                  total
                  createdAt
                }
              }
            }
          `,
          authMode: "userPool", // ensures only logged-in users fetch their history
        });

        const results = response.data?.listQuizHistories?.items || [];
        const sorted = results.sort(
          (a: QuizHistory, b: QuizHistory) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        );
        setQuizResults(sorted);
      } catch (err) {
        console.error("Error fetching quiz results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [client, user]);

  if (!user) {
    return (
      <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        <h1>Quiz History</h1>
        <div
          style={{
            padding: "2rem",
            backgroundColor: "#fff3cd",
            borderRadius: "8px",
            marginTop: "2rem",
          }}
        >
          <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
            Please log in to view your quiz history and track your progress.
          </p>
          <Link
            to="/login"
            style={{
              display: "inline-block",
              padding: "0.75rem 1.5rem",
              backgroundColor: "#007bff",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
            }}
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) return <div style={{ padding: "2rem", textAlign: "center" }}>Loading quiz history...</div>;
  if (quizResults.length === 0)
    return (
      <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        <h1>Quiz History</h1>
        <div
          style={{
            padding: "2rem",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            marginTop: "2rem",
          }}
        >
          <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
            You haven't taken any quizzes yet. Start practicing to track your progress!
          </p>
          <Link
            to="/quiz"
            style={{
              display: "inline-block",
              padding: "0.75rem 1.5rem",
              backgroundColor: "#007bff",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
            }}
          >
            Take a Quiz
          </Link>
        </div>
      </div>
    );

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Quiz History</h1>

      <div style={{ marginTop: "2rem" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8f9fa" }}>
              <th style={{ padding: "1rem", textAlign: "left", borderBottom: "2px solid #ddd" }}>Date</th>
              <th style={{ padding: "1rem", textAlign: "center", borderBottom: "2px solid #ddd" }}>Score</th>
              <th style={{ padding: "1rem", textAlign: "center", borderBottom: "2px solid #ddd" }}>Total Questions</th>
            </tr>
          </thead>
          <tbody>
            {quizResults.map((result) => (
              <tr key={result.id} style={{ backgroundColor: "#fff" }}>
                <td style={{ padding: "1rem", borderBottom: "1px solid #ddd" }}>
                  {result.createdAt ? new Date(result.createdAt).toLocaleString() : "N/A"}
                </td>
                <td style={{ padding: "1rem", textAlign: "center", borderBottom: "1px solid #ddd" }}>
                  {result.score ?? "-"}
                </td>
                <td style={{ padding: "1rem", textAlign: "center", borderBottom: "1px solid #ddd" }}>
                  {result.total ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
