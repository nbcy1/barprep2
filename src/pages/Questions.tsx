"use client";

import { useEffect, useState, useMemo } from "react";
import { generateClient } from "aws-amplify/api";
import { useAuthenticator } from "@aws-amplify/ui-react";

type Question = {
  id: string;
  question: string;
  choices: string[];
  answer: string;
  explanation?: string;
  topic?: string;
};

export default function Questions() {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Session tracking
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  const client = useMemo(() => generateClient(), []);
  const { user } = useAuthenticator((context) => [context.user]);

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const result = await client.graphql({
          query: `
            query ListQuestions {
              listQuestions {
                items {
                  id
                  question
                  choices
                  answer
                  explanation
                  topic
                }
              }
            }
          `,
        });
        const questions = result.data.listQuestions.items;
        setAllQuestions(questions);
        setError(null);
        shuffleSession(questions);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to load questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [client]);

  // Shuffle function
  const shuffleArray = (array: Question[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const shuffleSession = (questions: Question[]) => {
    setSessionQuestions(shuffleArray(questions));
    setCurrentIndex(0);
    setUserAnswer(null);
    setShowFeedback(false);
    setCorrectCount(0);
    setAnsweredCount(0);
  };

  const currentQuestion = sessionQuestions[currentIndex];

  const handleAnswer = async (choice: string) => {
    if (showFeedback) return;

    setUserAnswer(choice);
    setShowFeedback(true);

    const isCorrect = choice === currentQuestion.answer;

    setAnsweredCount((prev) => prev + 1);
    if (isCorrect) setCorrectCount((prev) => prev + 1);

    // Save to history if logged in
    if (user) {
      try {
        setSaving(true);
        await client.graphql({
          query: `
            mutation CreateQuizHistory($input: CreateQuizHistoryInput!) {
              createQuizHistory(input: $input) {
                id
              }
            }
          `,
          variables: {
            input: {
              topic: currentQuestion.topic || "General",
              totalQuestions: 1,
              correctAnswers: isCorrect ? 1 : 0,
              score: isCorrect ? 100 : 0,
              questionsAsked: [currentQuestion.id],
              userAnswers: JSON.stringify({ [currentQuestion.id]: choice }),
              completedAt: new Date().toISOString(),
            },
          },
        });
      } catch (err) {
        console.error("Error saving question history:", err);
      } finally {
        setSaving(false);
      }
    }
  };

  const handleNext = () => {
    setUserAnswer(null);
    setShowFeedback(false);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleRestart = () => {
    shuffleSession(allQuestions);
  };

  if (loading) return <div style={{ padding: "2rem" }}>Loading questions...</div>;
  if (error) return <div style={{ padding: "2rem", color: "red" }}>Error: {error}</div>;
  if (!currentQuestion) return <div style={{ padding: "2rem" }}>No questions available.</div>;

  const isCorrect = userAnswer === currentQuestion.answer;
  const progressPercentage = answeredCount > 0 ? (correctCount / answeredCount) * 100 : 0;

  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "0 auto" }}>
      <h1>Practice Questions</h1>

      {/* Session progress */}
      <div style={{ marginBottom: "1rem" }}>
        <strong>Session Progress:</strong>
        <div style={{ backgroundColor: "#e9ecef", borderRadius: "6px", overflow: "hidden", marginTop: "0.5rem" }}>
          <div
            style={{
              width: `${progressPercentage}%`,
              backgroundColor: "#28a745",
              color: "white",
              padding: "0.25rem 0",
              textAlign: "center",
              fontSize: "0.9rem",
              transition: "width 0.3s ease-in-out",
            }}
          >
            {correctCount} / {answeredCount} correct
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <strong>Question {currentIndex + 1} of {sessionQuestions.length}</strong>
      </div>

      <div style={{ padding: "1.5rem", backgroundColor: "white", borderRadius: "8px", border: "1px solid #ccc", marginBottom: "1rem" }}>
        <p style={{ fontSize: "1.2rem" }}>{currentQuestion.question}</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {currentQuestion.choices.map((choice) => {
          let backgroundColor = "#f5f5f5";
          let borderColor = "#ccc";

          if (showFeedback) {
            if (choice === currentQuestion.answer) {
              backgroundColor = "#d4edda";
              borderColor = "#28a745";
            } else if (choice === userAnswer) {
              backgroundColor = "#f8d7da";
              borderColor = "#dc3545";
            }
          }

          return (
            <button
              key={choice}
              onClick={() => handleAnswer(choice)}
              disabled={showFeedback}
              style={{
                padding: "1rem",
                backgroundColor,
                border: `2px solid ${borderColor}`,
                borderRadius: "6px",
                cursor: showFeedback ? "default" : "pointer",
                textAlign: "left",
              }}
            >
              {choice}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: isCorrect ? "#d4edda" : "#fff3cd", borderRadius: "6px", border: `2px solid ${isCorrect ? "#28a745" : "#ffc107"}` }}>
          <p>{isCorrect ? "Correct!" : "Incorrect."}</p>
          {currentQuestion.explanation && <p><strong>Explanation:</strong> {currentQuestion.explanation}</p>}
          {saving && <p style={{ color: "#666" }}>Saving result...</p>}
        </div>
      )}

      {showFeedback && currentIndex + 1 < sessionQuestions.length && (
        <button
          onClick={handleNext}
          style={{
            marginTop: "1rem",
            padding: "0.75rem 2rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Next
        </button>
      )}

      {showFeedback && currentIndex + 1 === sessionQuestions.length && (
        <div style={{ marginTop: "1rem" }}>
          <p>You have completed all questions!</p>
          <p>Your session score: {correctCount} / {answeredCount}</p>
          <button
            onClick={handleRestart}
            style={{
              marginTop: "1rem",
              padding: "0.75rem 2rem",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Restart Session
          </button>
        </div>
      )}
    </div>
  );
}

