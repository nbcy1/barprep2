import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ backgroundColor: "#333", padding: "1rem" }}>
      <ul style={{ listStyle: "none", display: "flex", gap: "2rem", margin: 0, padding: 0 }}>
        <li><Link to="/" style={{ color: "white", textDecoration: "none" }}>Home</Link></li>
        <li><Link to="/dashboard" style={{ color: "white", textDecoration: "none" }}>Dashboard</Link></li>
        <li><Link to="/questions" style={{ color: "white", textDecoration: "none" }}>Questions</Link></li>
        <li><Link to="/quiz" style={{ color: "white", textDecoration: "none" }}>Quiz</Link></li>
        <li><Link to="/history" style={{ color: "white", textDecoration: "none" }}>History</Link></li>
        <li><Link to="/account" style={{ color: "white", textDecoration: "none" }}>Account</Link></li>
        <li><Link to="/admin-questions" style={{ color: "white", textDecoration: "none" }}>Admin</Link></li>
        <li><Link to="/login" style={{ color: "white", textDecoration: "none" }}>Login</Link></li>
      </ul>
    </nav>
  );
}
