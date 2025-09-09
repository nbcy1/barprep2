// src/pages/Account.tsx
import { useEffect, useState } from 'react'
import * as AuthModule from '@aws-amplify/auth'

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
        console.error('Failed to fetch user', err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <div className="page">Loading account info…</div>

  return (
    <div className="page">
      <h2>Account Info</h2>
      {user ? (
        <div>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.attributes?.email ?? 'N/A'}
          </p>
          <p>
            <strong>User ID:</strong> {user.attributes?.sub ?? 'N/A'}
          </p>
        </div>
      ) : (
        <p className="muted">No user logged in.</p>
      )}
    </div>
  )
}

