import { Link } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';

export default function Navbar() {
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  
  return (
    <nav style={{ backgroundColor: "#333", padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <ul style={{ listStyle: "none", display: "flex", gap: "2rem", margin: 0, padding: 0 }}>
        <li><Link to="/" style={{ color: "white", textDecoration: "none" }}>Home</Link></li>
        {user && (
          <>
            <li><Link to="/dashboard" style={{ color: "white", textDecoration: "none" }}>Dashboard</Link></li>
            <li><Link to="/history" style={{ color: "white", textDecoration: "none" }}>Performance</Link></li>
          </>
        )}
        <li><Link to="/questions" style={{ color: "white", textDecoration: "none" }}>Questions</Link></li>
        <li><Link to="/quiz" style={{ color: "white", textDecoration: "none" }}>Quiz</Link></li>
        {user && (
          <>
            <li><Link to="/account" style={{ color: "white", textDecoration: "none" }}>Account</Link></li>
            <li><Link to="/admin-questions" style={{ color: "white", textDecoration: "none" }}>Admin</Link></li>
          </>
        )}
      </ul>
      <div>
        {user ? (
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <span style={{ color: "white" }}>Hello, {user.signInDetails?.loginId || user.username}</span>
            <button 
              onClick={signOut}
              style={{ padding: "0.5rem 1rem", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link to="/login" style={{ color: "white", textDecoration: "none", padding: "0.5rem 1rem", backgroundColor: "#007bff", borderRadius: "4px" }}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
