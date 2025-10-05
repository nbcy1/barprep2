import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { listQuestions } from "../graphql/queries";

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

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

      const result: any = await API.graphql(graphqlOperation(listQuestions));
      if (result?.data?.listQuestions?.items) {
        setQuestions(result.data.listQuestions.items);
      } else {
        setQuestions([]);
      }
    } catch (err: any) {
      console.error("Error fetching questions:", err);
      setError(err.message || "Unknown error");
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  if (loading) return <div>Loading questions...</div>;
  if (error) return <div>Error: {error}</div>;
  if (questions.length === 0) return <div>No questions found.</div>;

  return (
    <div className="questions-page">
      <h1>Quiz Questions</h1>
      {questions.map((q) => (
        <div key={q.id} className="question-card">
          <h2>{q.question}</h2>
          <ul>
            {q.choices.map((choice, index) => (
              <li key={index}>{choice}</li>
            ))}
          </ul>
          {q.explanation && <p><strong>Explanation:</strong> {q.explanation}</p>}
          {q.topic && <p><strong>Topic:</strong> {q.topic}</p>}
        </div>
      ))}
    </div>
  );
};

export default Questions;
