"use client";

import React, { useEffect, useState, useMemo } from "react";
import { generateClient } from "aws-amplify/api";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Link } from "react-router-dom";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

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
  const client = useMemo(() => generateClient(), []);

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
          authMode: "userPool" as any,
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

  // Calculate statistics
  const stats = useMemo(() => {
    if (quizResults.length === 0) return null;

    const totalQuizzes = quizResults.length;
    const totalQuestions = quizResults.reduce((sum, r) => sum + (r.total || 0), 0);
    const totalCorrect = quizResults.reduce((sum, r) => sum + (r.score || 0), 0);
    const averageScore = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
    
    const scores = quizResults.map(r => 
      r.total && r.total > 0 ? (r.score || 0) / r.total * 100 : 0
    );
    const bestScore = Math.max(...scores);
    const recentAverage = quizResults.slice(0, Math.min(5, quizResults.length))
      .reduce((sum, r) => {
        const percentage = r.total && r.total > 0 ? (r.score || 0) / r.total * 100 : 0;
        return sum + percentage;
      }, 0) / Math.min(5, quizResults.length);

    return {
      totalQuizzes,
      totalQuestions,
      totalCorrect,
      averageScore,
      bestScore,
      recentAverage
    };
  }, [quizResults]);

  // Prepare data for line chart (progress over time)
  const progressData = useMemo(() => {
    return quizResults
      .slice()
      .reverse()
      .map((result, index) => ({
        quiz: `Quiz ${index + 1}`,
        percentage: result.total && result.total > 0 
          ? Math.round((result.score || 0) / result.total * 100) 
          : 0,
        date: result.createdAt 
          ? new Date(result.createdAt).toLocaleDateString() 
          : 'N/A'
      }));
  }, [quizResults]);

  // Prepare data for pie chart (overall performance)
  const performanceData = useMemo(() => {
    if (!stats) return [];
    const correct = stats.totalCorrect;
    const incorrect = stats.totalQuestions - stats.totalCorrect;
    return [
      { name: 'Correct', value: correct, color: '#28a745' },
      { name: 'Incorrect', value: incorrect, color: '#dc3545' }
    ];
  }, [stats]);

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
  
  if (quizResults.length === 0) {
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
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "2rem" }}>Performance Stats</h1>

      {/* Stats Cards */}
      {stats && (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "1.5rem", 
          marginBottom: "3rem" 
        }}>
          <div style={{ 
            backgroundColor: "#fff", 
            padding: "1.5rem", 
            borderRadius: "8px", 
            border: "1px solid #ddd",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <div style={{ fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem" }}>Total Quizzes</div>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#007bff" }}>{stats.totalQuizzes}</div>
          </div>

          <div style={{ 
            backgroundColor: "#fff", 
            padding: "1.5rem", 
            borderRadius: "8px", 
            border: "1px solid #ddd",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <div style={{ fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem" }}>Average Score</div>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#28a745" }}>
              {stats.averageScore.toFixed(1)}%
            </div>
          </div>

          <div style={{ 
            backgroundColor: "#fff", 
            padding: "1.5rem", 
            borderRadius: "8px", 
            border: "1px solid #ddd",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <div style={{ fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem" }}>Best Score</div>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#ffc107" }}>
              {stats.bestScore.toFixed(1)}%
            </div>
          </div>

          <div style={{ 
            backgroundColor: "#fff", 
            padding: "1.5rem", 
            borderRadius: "8px", 
            border: "1px solid #ddd",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <div style={{ fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem" }}>Recent Avg (Last 5)</div>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#17a2b8" }}>
              {stats.recentAverage.toFixed(1)}%
            </div>
          </div>

          <div style={{ 
            backgroundColor: "#fff", 
            padding: "1.5rem", 
            borderRadius: "8px", 
            border: "1px solid #ddd",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <div style={{ fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem" }}>Questions Answered</div>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#6c757d" }}>
              {stats.totalQuestions}
            </div>
          </div>

          <div style={{ 
            backgroundColor: "#fff", 
            padding: "1.5rem", 
            borderRadius: "8px", 
            border: "1px solid #ddd",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <div style={{ fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem" }}>Correct Answers</div>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#28a745" }}>
              {stats.totalCorrect}
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))", 
        gap: "2rem", 
        marginBottom: "3rem" 
      }}>
        {/* Progress Over Time Chart */}
        <div style={{ 
          backgroundColor: "#fff", 
          padding: "1.5rem", 
          borderRadius: "8px", 
          border: "1px solid #ddd",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ marginBottom: "1rem" }}>Progress Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quiz" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="percentage" 
                stroke="#007bff" 
                strokeWidth={2}
                name="Score (%)"
                dot={{ fill: '#007bff', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Overall Performance Pie Chart */}
        <div style={{ 
          backgroundColor: "#fff", 
          padding: "1.5rem", 
          borderRadius: "8px", 
          border: "1px solid #ddd",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ marginBottom: "1rem" }}>Overall Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={performanceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => 
                  `${name}: ${value} (${(percent * 100).toFixed(1)}%)`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {performanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Score Distribution Bar Chart */}
      <div style={{ 
        backgroundColor: "#fff", 
        padding: "1.5rem", 
        borderRadius: "8px", 
        border: "1px solid #ddd",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        marginBottom: "3rem"
      }}>
        <h3 style={{ marginBottom: "1rem" }}>Recent Quiz Scores</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={progressData.slice(-10)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="quiz" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="percentage" fill="#28a745" name="Score (%)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Quiz History Table */}
      <div style={{ 
        backgroundColor: "#fff", 
        padding: "1.5rem", 
        borderRadius: "8px", 
        border: "1px solid #ddd",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <h3 style={{ marginBottom: "1rem" }}>Recent Quizzes</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <th style={{ padding: "1rem", textAlign: "left", borderBottom: "2px solid #ddd" }}>Date</th>
                <th style={{ padding: "1rem", textAlign: "center", borderBottom: "2px solid #ddd" }}>Score</th>
                <th style={{ padding: "1rem", textAlign: "center", borderBottom: "2px solid #ddd" }}>Total Questions</th>
                <th style={{ padding: "1rem", textAlign: "center", borderBottom: "2px solid #ddd" }}>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {quizResults.slice(0, 10).map((result) => {
                const percentage = result.total && result.total > 0 
                  ? ((result.score || 0) / result.total * 100).toFixed(1)
                  : '0';
                const percentNum = parseFloat(percentage);
                
                return (
                  <tr key={result.id} style={{ backgroundColor: "#fff" }}>
                    <td style={{ padding: "1rem", borderBottom: "1px solid #ddd" }}>
                      {result.createdAt ? new Date(result.createdAt).toLocaleString() : "N/A"}
                    </td>
                    <td style={{ padding: "1rem", textAlign: "center", borderBottom: "1px solid #ddd" }}>
                      {result.score ?? "-"} / {result.total ?? "-"}
                    </td>
                    <td style={{ padding: "1rem", textAlign: "center", borderBottom: "1px solid #ddd" }}>
                      {result.total ?? "-"}
                    </td>
                    <td style={{ 
                      padding: "1rem", 
                      textAlign: "center", 
                      borderBottom: "1px solid #ddd",
                      fontWeight: "bold",
                      color: percentNum >= 80 ? "#28a745" : percentNum >= 60 ? "#ffc107" : "#dc3545"
                    }}>
                      {percentage}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Call to Action */}
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <Link
          to="/quiz"
          style={{
            display: "inline-block",
            padding: "1rem 2rem",
            backgroundColor: "#007bff",
            color: "white",
            textDecoration: "none",
            borderRadius: "6px",
            fontSize: "1.1rem",
            fontWeight: "bold"
          }}
        >
          Take Another Quiz
        </Link>
      </div>
    </div>
  );
}
