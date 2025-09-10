import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
      <Link to="/dashboard" style={{ marginRight: '1rem' }}>Dashboard</Link>
      <Link to="/questions" style={{ marginRight: '1rem' }}>Questions</Link>
      <Link to="/history" style={{ marginRight: '1rem' }}>History</Link>
      <Link to="/account" style={{ marginRight: '1rem' }}>Account</Link>
      <Link to="/login">Login</Link>
    </nav>
  )
}
