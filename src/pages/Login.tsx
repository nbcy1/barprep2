// src/pages/Login.tsx
import React from 'react'
import { AmplifyAuthenticator, AmplifySignIn, AmplifySignUp } from '@aws-amplify/ui-react'

export default function Login() {
  return (
    <AmplifyAuthenticator>
      {/* Sign-in form */}
      <AmplifySignIn slot="sign-in" hideSignUp={false} />

      {/* Optional: Customize sign-up form */}
      <AmplifySignUp
        slot="sign-up"
        formFields={[
          { type: 'username' },
          { type: 'password' },
          { type: 'email' },
        ]}
      />
    </AmplifyAuthenticator>
  )
}
