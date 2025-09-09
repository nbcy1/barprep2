import { useEffect, useState } from 'react'
import { Auth } from 'aws-amplify'

export default function Account() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const authUser = await Auth.currentAuthenticatedUser()
        setUser(authUser)
      } catch (err) {
        console.error('Failed to load user', err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <div className="page">Loading account info…</div>

  if (!user)
    return (
      <div className="page">
        <p className="muted">No user is currently signed in.</p>
      </div>
    )

  return (
    <div className="page">
      <h2>Account Information</h2>
      <div className="card">
        <p>
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.attributes?.email ?? 'Not provided'}
        </p>
        <p>
          <strong>Sub:</strong> {user.attributes?.sub}
        </p>
      </div>
    </div>
  )
}
