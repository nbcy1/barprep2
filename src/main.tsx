// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Amplify setup
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import { DataStore } from '@aws-amplify/datastore';
import { API } from '@aws-amplify/api';
import { Auth } from '@aws-amplify/auth';

Amplify.configure({
  ...awsExports,
  API,
  Auth,
  DataStore,
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
