import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Amplify setup
import { Amplify } from 'aws-amplify'
import amplifyConfig from './aws-exports'  // <- import from src folder

Amplify.configure(amplifyConfig)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
