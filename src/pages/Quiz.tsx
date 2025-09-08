import { useEffect, useMemo, useState } from 'react'
import QuestionCard, { Question as QType } from '../components/QuestionCard'
import { API } from 'aws-amplify'
import  Auth  from '@aws-amplify/auth'
import { listQuestions } from '../graphql/queries'
import { createAnswerAttempt } from '../graphql/mutations'
import type { ListQuestionsQuery } from '../graphql/types'

const FALLBACK: QType[] = [
  {
    category: 'Crim Pro',
    text: 'A suspect is interrogated without Miranda warnings. Which statement is true?',
    options: [
      'Always inadmissible',
      'Admissible for impeachment',
      'Admissible substantively',
      'Miranda applies only post-charge'
    ],
    explanation:
      'Unwarned statements can be used for impeachment but not in the prosecution case-in-chief.'
  },
  {
    category: 'Contracts',
    text: 'Consideration is best described as:',
    options: [
      'A promise to make a gift',
      'Bargained-for legal detriment',
      'Moral obligation',
      'Past performance'
    ],
    explanation: 'Consideration requires a bargained-for exchange involving legal detriment.'
  }
]

export default function Quiz() {
  const [questions, setQuestions] = useState<QType[]>([])
  const [idx, setIdx] = useState(0)
  const [lastResult, setLastResult] = useState<{ correct: boolean | null; explanation?: string } | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      // try get auth user id
      try {
        const authUser = await Auth.currentAuthenticatedUser()
        // Amplify Cognito user object varies; prefer sub if available, else username
        setUserId(authUser?.attributes?.sub ?? authUser?.username ?? null)
      } catch (err) {
        console.warn('Auth not ready or user not signed in', err)
      }

      // fetch questions from GraphQL API
      try {
        const resp: any = await API.graphql({ query: listQuestions })
        const items = (resp?.data?.listQuestions?.items as any[]) || []
        if (items && items.length) {
          const normalized: QType[] = items.map((q: any) => ({
            id: q.id,
            category: q.category,
            text: q.text,
            options: q.options || [],
            explanation: q.explanation,
            correctIndex: q.correctIndex
          }))
          setQuestions(normalized)
        } else {
          setQuestions(FALLBACK)
        }
      } catch (e) {
        console.error('Failed to load questions from API, using fallback', e)
        setQuestions(FALLBACK)
      }
    })()
  }, [])

  const current = useMemo(() => questions[idx], [questions, idx])
  if (!current) return <div className="page">Loading questions…</div>

  const handleSubmit = async (selected: number) => {
    const isCorrect = typeof current.correctIndex === 'number' ? selected === current.correctIndex : null
    setLastResult({ correct: isCorrect, explanation: current.explanation })

    // record attempt if possible (best-effort)
    if (userId) {
      try {
        const input = {
          userID: userId,
          questionID: current.id ?? undefined,
          selectedIndex: selected,
          isCorrect,
          category: current.category,
          createdAt: new Date().toISOString()
        }
        await API.graphql({ query: createAnswerAttempt, variables: { input } })
      } catch (err) {
        console.error('createAnswerAttempt failed', err)
      }
    }

    setTimeout(() => {
      setIdx((i) => Math.min(i + 1, questions.length - 1))
      setLastResult(null)
    }, 1200)
  }

  return (
    <div className="page">
      <div className="card">
        <div className="muted">
          Question {idx + 1} / {questions.length}
        </div>
      </div>

      <QuestionCard question={current} onSubmit={handleSubmit} />

      {lastResult && (
        <div className="card" style={{ marginTop: 12 }}>
          <strong>{lastResult.correct ? 'Correct ✅' : lastResult.correct === false ? 'Incorrect ❌' : 'Recorded ✅'}</strong>
          {current.explanation && <p className="muted">{current.explanation}</p>}
        </div>
      )}
    </div>
  )
}
