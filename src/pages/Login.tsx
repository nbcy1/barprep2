import React from 'react'
import { Authenticator } from '@aws-amplify/ui-react'

export default function Login() {
  return (
    <div className="page">
      <h2>Login</h2>
      <Authenticator />
    </div>
  )
}
