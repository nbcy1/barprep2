import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function LoginContent() {
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Show nothing while authenticator handles login
  }

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <p>Welcome, {user.username}!</p>
      <p>Redirecting to dashboard...</p>
      <button 
        onClick={signOut} 
        style={{ 
          padding: "0.75rem 1.5rem", 
          marginTop: "1rem",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Sign Out
      </button>
    </div>
  );
}

export default function Login() {
  return (
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Login or Sign Up</h1>
      <Authenticator>
        <LoginContent />
      </Authenticator>
    </div>
  );
}
