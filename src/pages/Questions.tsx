import React, { useEffect, useState } from "react"
import { generateClient } from "aws-amplify/data"
import type { Schema } from "../amplify/data/resource"

interface Question {
  id: string
  content: string
  topic?: string
}

const Questions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([])
  const client = generateClient<Schema>()

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const result = await client.models.Question.list()
        setQuestions(result)
      } catch (err) {
        console.error("Error fetching questions:", err)
      }
    }

    fetchQuestions()
  }, [])

  return (
    <div>
      <h1>Questions</h1>
      <ul>
        {questions.map(q => (
          <li key={q.id}>{q.content}</li>
        ))}
      </ul>
    </div>
  )
}

export default Questions

