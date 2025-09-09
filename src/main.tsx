import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Amplify setup
import { Amplify } from 'aws-amplify'
import { awsconfig } from './aws-exports'  // <- use named import

Amplify.configure(awsconfig)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
