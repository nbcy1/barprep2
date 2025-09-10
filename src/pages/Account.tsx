import { useEffect, useState } from 'react'
import * as AuthModule from '@aws-amplify/auth'

const Auth = AuthModule.Auth

export default function Account() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser()
        setUser(currentUser)
      } catch {
        setUser(null)
      }
    })()
  }, [])

  return (
    <div className="page">
      <h2>Account</h2>
      {user ? (
        <p>Welcome, {user.username}</p>
      ) : (
        <p>No user logged in</p>
      )}
    </div>
  )
}

