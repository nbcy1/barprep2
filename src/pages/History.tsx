"use client"

import React, { useEffect, useState, useMemo } from "react"
import { generateClient } from "aws-amplify/api"
import { useAuthenticator } from '@aws-amplify/ui-react'
import { Link } from 'react-router-dom'

type QuizResult = {
  id: string
  topic: string
  totalQuestions: number
  correctAnswers: number
  score: number
  completedAt: string
}

type TopicStats = {
  topic: string
  totalQuizzes: number
  averageScore: number
  totalQuestions: number
  totalCorrect: number
}

export default function History() {
  const [quizResults, setQuizResults] = useState<QuizResult[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuthenticator((context) => [context.user])
  const client = useMemo(() => generateClient(), [])

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const fetchResults = async () => {
      try {
        setLoading(true)
        const response = await client.graphql({
          query: `
            query ListQuizResults($filter: ModelQuizResultFilterInput) {
              listQuizResults(filter: $filter, limit: 100) {
                items {
                  id
                  topic
                  totalQuestions
                  correctAnswers
                  score
                  completedAt
                }
              }
            }
          `,
          variables: {
            filter: {
              userId: { eq: user.username }
            }
          }
        })
        
        const results = response.data.listQuizResults.items
        const sorted = results.sort((a: QuizResult, b: QuizResult) => 
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
        )
        setQuizResults(sorted)
      } catch (error) {
        console.error("Error fetching quiz results:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [client, user])

  const topicStats = useMemo(() => {
    const statsMap = new Map<string, TopicStats>()
    
    quizResults.forEach(result => {
      const existing = statsMap.get(result.topic) || {
        topic: result.topic,
        totalQuizzes: 0,
        averageScore: 0,
        totalQuestions: 0,
        totalCorrect: 0
      }
      
      existing.totalQuizzes++
      existing.totalQuestions += result.totalQuestions
      existing.totalCorrect += result.correctAnswers
      existing.averageScore = (existing.totalCorrect / existing.totalQuestions) * 100
      
      statsMap.set(result.topic, existing)
    })
    
    return Array.from(statsMap.values()).sort((a, b) => b.averageScore - a.averageScore)
  }, [quizResults])

  const overallStats = useMemo(() => {
    if (quizResults.length === 0) return null
    
    const totalQuestions = quizResults.reduce((sum, r) => sum + r.totalQuestions, 0)
    const totalCorrect = quizResults.reduce((sum, r) => sum + r.correctAnswers, 0)
    const averageScore = (totalCorrect / totalQuestions) * 100
    
    return {
      totalQuizzes: quizResults.length,
      totalQuestions,
      totalCorrect,
      averageScore
    }
  }, [quizResults])

  if (!user) {
    return (
      <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        <h1>Quiz History</h1>
        <div style={{ 
          padding: "2rem", 
          backgroundColor: "#fff3cd", 
          borderRadius: "8px",
          marginTop: "2rem"
        }}>
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
              borderRadius: "4px"
            }}
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Loading your quiz history...</div>
  }

  if (quizResults.length === 0) {
    return (
      <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        <h1>Quiz History</h1>
        <div style={{ 
          padding: "2rem", 
          backgroundColor: "#f8f9fa", 
          borderRadius: "8px",
          marginTop: "2rem"
        }}>
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
              borderRadius: "4px"
            }}
          >
            Take a Quiz
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Quiz History</h1>

      {/* Overall Stats */}
      {overallStats && (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginTop: "2rem",
          marginBottom: "3rem"
        }}>
          <div style={{ 
            padding: "1.5rem", 
            backgroundColor: "#e7f3ff", 
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#007bff" }}>
              {overallStats.totalQuizzes}
            </div>
            <div style={{ color: "#666" }}>Total Quizzes</div>
          </div>
          <div style={{ 
            padding: "1.5rem", 
            backgroundColor: "#d4edda", 
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#28a745" }}>
              {Math.round(overallStats.averageScore)}%
            </div>
            <div style={{ color: "#666" }}>Average Score</div>
          </div>
          <div style={{ 
            padding: "1.5rem", 
            backgroundColor: "#fff3cd", 
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#856404" }}>
              {overallStats.totalCorrect}/{overallStats.totalQuestions}
            </div>
            <div style={{ color: "#666" }}>Questions Correct</div>
          </div>
        </div>
      )}

      {/* Performance by Topic */}
      <div style={{ marginBottom: "3rem" }}>
        <h2>Performance by Topic</h2>
        <div style={{ backgroundColor: "white", borderRadius: "8px", overflow: "hidden", border: "1px solid #ddd" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <th style={{ padding: "1rem", textAlign: "left", borderBottom: "2px solid #ddd" }}>Topic</th>
                <th style={{ padding: "1rem", textAlign: "center", borderBottom: "2px solid #ddd" }}>Quizzes</th>
                <th style={{ padding: "1rem", textAlign: "center", borderBottom: "2px solid #ddd" }}>Questions</th>
                <th style={{ padding: "1rem", textAlign: "center", borderBottom: "2px solid #ddd" }}>Correct</th>
                <th style={{ padding: "1rem", textAlign: "center", borderBottom: "2px solid #ddd" }}>Average</th>
              </tr>
            </thead>
            <tbody>
              {topicStats.map((stat, index) => (
                <tr key={stat.topic} style={{ backgroundColor: index % 2 === 0 ? "white" : "#f8f9fa" }}>
                  <td style={{ padding: "1rem", borderBottom: "1px solid #ddd" }}>{stat.topic}</td>
                  <td style={{ padding: "1rem", textAlign: "center", borderBottom: "1px solid #ddd" }}>{stat.totalQuizzes}</td>
                  <td style={{ padding: "1rem", textAlign: "center", borderBottom: "1px solid #ddd" }}>{stat.totalQuestions}</td>
                  <td style={{ padding: "1rem", textAlign: "center", borderBottom: "1px solid #ddd" }}>{stat.totalCorrect}</td>
                  <td style={{ 
                    padding: "1rem", 
                    textAlign: "center", 
                    borderBottom: "1px solid #ddd",
                    fontWeight: "bold",
                    color: stat.averageScore >= 70 ? "#28a745" : stat.averageScore >= 50 ? "#ffc107" : "#dc3545"
                  }}>
                    {Math.round(stat.averageScore)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Quiz Results */}
      <div>
        <h2>Recent Quizzes</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {quizResults.slice(0, 10).map(result => (
            <div 
              key={result.id}
              style={{
                padding: "1.5rem",
                backgroundColor: "white",
                borderRadius: "8px",
                border: "1px solid #ddd",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <div style={{ fontWeight: "bold", fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                  {result.topic}
                </div>
                <div style={{ color: "#666", fontSize: "0.9rem" }}>
                  {new Date(result.completedAt).toLocaleDateString()} at {new Date(result.completedAt).toLocaleTimeString()}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: result.score >= 70 ? "#28a745" : result.score >= 50 ? "#ffc107" : "#dc3545" }}>
                  {Math.round(result.score)}%
                </div>
                <div style={{ color: "#666", fontSize: "0.9rem" }}>
                  {result.correctAnswers}/{result.totalQuestions} correct
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
