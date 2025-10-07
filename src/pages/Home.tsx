import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
        background: "linear-gradient(to right, #f0f4f8, #d9e2ec)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Hero Card */}
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem 3rem",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          textAlign: "center",
          maxWidth: "600px",
          width: "100%",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#1f2937" }}>
          Welcome to BarPrep!
        </h1>
        <p style={{ fontSize: "1.1rem", marginBottom: "2rem", color: "#4b5563" }}>
          Practice questions, track your progress, and ace the bar exam with confidence.
        </p>

        {/* Quick Links */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            to="/questions"
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#3b82f6",
              color: "white",
              textDecoration: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              transition: "all 0.2s",
            }}
          >
            Practice Questions
          </Link>
          <Link
            to="/quiz"
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#10b981",
              color: "white",
              textDecoration: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              transition: "all 0.2s",
            }}
          >
            Take a Quiz
          </Link>
          <Link
            to="/history"
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#f59e0b",
              color: "white",
              textDecoration: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              transition: "all 0.2s",
            }}
          >
            View History
          </Link>
        </div>
      </div>

      {/* Footer Note */}
      <p style={{ marginTop: "2rem", color: "#6b7280", fontSize: "0.9rem", textAlign: "center" }}>
        Use the navbar above for more options and account settings.
      </p>
    </div>
  );
}
