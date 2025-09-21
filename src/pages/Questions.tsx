import { useEffect, useState } from "react";
import { generateClient } from "@aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export default function Questions() {
  const [questions, setQuestions] = useState<Schema["Question"]["type"][]>([]);
  const [selected, setSelected] = useState<{ [id: string]: string }>({});

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const result = await client.models.Question.list();
        setQuestions(result.data);
      } catch (err) {
        console.error("Error fetching questions:", err);
      }
    }
    fetchQuestions();
  }, []);

  async function handleAnswer(questionId: string, choice: string) {
    try {
      await client.models.Answer.create({
        questionId,
        userId: "CURRENT_USER_ID", // later replace with Amplify Auth
        choice,
      });
      setSelected((prev) => ({ ...prev, [questionId]: choice }));
    } catch (err) {
      console.error("Error saving answer:", err);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Practice Questions</h1>
      {questions.map((q) => {
        const choices = JSON.parse(q.choices || "[]");
        return (
          <div key={q.id} className="mb-6 border p-4 rounded">
            <h2 className="font-semibold mb-2">{q.question}</h2>
            <ul>
              {choices.map((c: string, idx: number) => (
                <li key={idx}>
                  <button
                    onClick={() => handleAnswer(q.id, c)}
                    className={`px-3 py-1 border rounded mb-1 block w-full text-left ${
                      selected[q.id] === c ? "bg-blue-200" : ""
                    }`}
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
