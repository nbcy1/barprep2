// src/pages/Login.tsx
import React from 'react'
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

export default function Login() {
  return (
    <div style={{ padding: '2rem' }}>
      <Authenticator>
        {({ signOut, user }) => (
          <div>
            <h2>Welcome, {user?.username}</h2>
            <button onClick={signOut}>Sign Out</button>
          </div>
        )}
      </Authenticator>
    </div>
  )
}
