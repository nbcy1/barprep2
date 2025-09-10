import { useEffect, useState } from 'react'
import * as API_Module from '@aws-amplify/api'
import { listQuestions } from '../graphql/queries'

const API = API_Module.API

type Question = {
  id: string
  category: string
  text: string
  options: string[]
  correctIndex: number
  explanation?: string
}

export default function Questions() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const res: any = await API.graphql({ query: listQuestions })
        setQuestions(res?.data?.listQuestions?.items || [])
      } catch (err) {
        console.error('Failed to load questions', err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <div className="page">Loading questions…</div>

  return (
    <div className="page">
      <h2>Questions</h2>
      <ul>
        {questions.map((q) => (
          <li key={q.id}>
            <strong>{q.category}</strong>: {q.text}
          </li>
        ))}
      </ul>
    </div>
  )
}

