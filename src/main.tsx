import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Amplify setup
import { Amplify } from 'aws-amplify'
// Import the Gen 2 JSON outputs directly
import amplifyConfig from '../amplify/amplify_outputs.json'

Amplify.configure(amplifyConfig)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
