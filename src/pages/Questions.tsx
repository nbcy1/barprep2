// src/pages/Questions.tsx
import React, { useEffect, useState } from 'react'
import { API } from 'aws-amplify'
import { listQuestions } from '../graphql/queries'

type Question = {
  id: string
  category?: string
  text: string
  options: string[]
  correctIndex: number
}

export default function Questions() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [answers, setAnswers] = useState<{ [id: string]: number | null }>({})

  useEffect(() => {
    ;(async () => {
      try {
        const res: any = await API.graphql({ query: listQuestions })
        const items = res?.data?.listQuestions?.items ?? []
        setQuestions(items)
        // initialize answers
        const initAnswers: { [id: string]: number | null } = {}
        items.forEach((q: Question) => {
          initAnswers[q.id] = null
        })
        setAnswers(initAnswers)
      } catch (err) {
        console.error('Failed to load questions', err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const handleAnswer = (qid: string, choice: number) => {
    setAnswers({ ...answers, [qid]: choice })
  }

  if (loading) return <div className="page">Loading questions…</div>

  return (
    <div className="page">
      <h2>Practice Questions</h2>
      {questions.length === 0 && <p>No questions available.</p>}
      <ul>
        {questions.map((q) => (
          <li key={q.id} style={{ marginBottom: '1rem' }}>
            <strong>{q.category ?? 'Uncategorized'}:</strong> {q.text}
            <ul>
              {q.options.map((opt, idx) => (
                <li key={idx}>
                  <label>
                    <input
                      type="radio"
                      name={q.id}
                      checked={answers[q.id] === idx}
                      onChange={() => handleAnswer(q.id, idx)}
                    />
                    {opt}
                  </label>
                </li>
              ))}
            </ul>
            {answers[q.id] !== null && (
              <p>
                {answers[q.id] === q.correctIndex
                  ? '✅ Correct!'
                  : `❌ Incorrect. Correct answer: ${q.options[q.correctIndex]}`}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
