import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export default function Questions() {
  const [questions, setQuestions] = useState<Schema["Question"]["type"][]>([]);
  const [selected, setSelected] = useState<{ [id: string]: string }>({});

  // fetch questions on mount
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const { data } = await client.models.Question.list();
        setQuestions(data);
      } catch (err) {
        console.error("Error fetching questions:", err);
      }
    }
    fetchQuestions();
  }, []);

  // handle user answer submission
  async function submitAnswer(questionId: string, choice: string) {
    try {
      await client.models.Answer.create({
        questionId,
        selected: choice,
        userId: "CURRENT_USER_ID", // TODO: replace with actual userId from Auth
      });
      setSelected((prev) => ({ ...prev, [questionId]: choice }));
    } catch (err) {
      console.error("Error submitting answer:", err);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Practice Questions</h1>
      {questions.length === 0 ? (
        <p className="text-gray-500">No questions available.</p>
      ) : (
        questions.map((q) => (
          <div key={q.id} className="mb-6 border-b pb-4">
            <p className="font-semibold mb-2">{q.text}</p>
            <div className="pl-4">
              {q.choices?.map((c, i) => (
                <button
                  key={i}
                  onClick={() => submitAnswer(q.id, c)}
                  className={`block w-full text-left my-2 p-2 border rounded transition-colors ${
                    selected[q.id] === c
                      ? "bg-green-200 border-green-400"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
