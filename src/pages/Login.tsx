import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Login() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Login or Sign Up</h1>
      <Authenticator>
        {({ signOut, user }) => {
          // Redirect to dashboard after successful login
          useEffect(() => {
            if (user) {
              navigate('/dashboard');
            }
          }, [user]);

          return (
            <div style={{ textAlign: "center" }}>
              <p>Welcome, {user?.username}!</p>
              <button onClick={signOut} style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}>
                Sign Out
              </button>
            </div>
          );
        }}
      </Authenticator>
    </div>
  );
}
