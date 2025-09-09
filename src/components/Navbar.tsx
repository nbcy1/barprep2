// src/components/Navbar.tsx
import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthenticator } from '@aws-amplify/ui-react'

export default function Navbar() {
  const { user, signOut } = useAuthenticator((context) => [context.user])

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
      <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
      <Link to="/dashboard" style={{ marginRight: '1rem' }}>Dashboard</Link>
      <Link to="/history" style={{ marginRight: '1rem' }}>History</Link>
      <Link to="/account" style={{ marginRight: '1rem' }}>Account</Link>
