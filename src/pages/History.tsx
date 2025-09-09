import { useEffect, useState } from 'react'
import { API, Auth } from 'aws-amplify' // ✅ fixed import
import { listAnswerAttempts } from '../graphql/queries'

type Attempt = {
  id: string
  questionID: string
  category?: string
  selectedIndex: number
  isCorrect?: boolean | null
  createdAt: string
}

export default function History() {
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const user = await Auth.currentAuthenticatedUser()
        const userId = user?.attributes?.sub ?? user?.username

        const res: any = await API.graphql({
          query: listAnswerAttempts,
          variables: { filter: { userID: { eq: userId } } }
        })

        setAttempts(res?.data?.listAnswerAttempts?.items || [])
      } catch (err) {
        console.error('Failed to load history', err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <div className="page">Loading history…</div>

  return (
    <div className="page">
      <h2>Your Answer History</h2>
      {attempts.length === 0 && <p className="muted">No attempts recorded yet.</p>}
      <ul className="card">
        {attempts.map((a) => (
          <li key={a.id} style={{ marginBottom: 8 }}>
            <div>
              <strong>{a.category ?? 'Unknown Category'}</strong> —{' '}
              {a.isCorrect ?
