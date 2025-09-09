import { useEffect, useState } from 'react'
import * as AuthModule from '@aws-amplify/auth'  // <- import as module
const Auth = AuthModule.Auth

export default function Account() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser()
        setUser(currentUser)
      } catch (err) {
        console.error('Failed to load account', err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <div className="page">Loading account…</div>

  return (
    <div className="page">
      <h2>Your Account</h2>
      {user ? (
        <ul>
          <li>Username: {user.username}</li>
          <li>Email: {user.attributes?.email}</li>
        </ul>
      ) : (
        <p className="muted">No user logged in.</p>
      )}
    </div>
  )
}

