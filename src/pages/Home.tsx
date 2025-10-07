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
        background: "radial-gradient(circle at top, #ff00ff, #00ffff)",
        fontFamily: "'Press Start 2P', cursive, sans-serif",
        color: "#fff",
        padding: "2rem",
      }}
    >
      {/* Main Container */}
      <div
        style={{
          background: "linear-gradient(135deg, #ffcc00, #ff00cc)",
          border: "4px solid #00ffff",
          borderRadius: "16px",
          padding: "2rem 3rem",
          textAlign: "center",
          maxWidth: "600px",
          width: "100%",
          boxShadow: "0 0 20px #00ffff, 0 0 40px #ff00ff",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem", textShadow: "2px 2px #000" }}>
          Welcome to BarPrep!
        </h1>
        <p style={{ fontSize: "0.9rem", marginBottom: "2rem", textShadow: "1px 1px #000" }}>
          Prepare for the bar exam with our innovative question and quiz features! Create an account to start tracking your progress.
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            to="/questions"
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#ff00ff",
              color: "#00ffff",
              textDecoration: "none",
              border: "2px solid #00ffff",
              borderRadius: "8px",
              fontWeight: "bold",
              textShadow: "1px 1px #000",
              transition: "all 0.2s",
              boxShadow: "0 0 5px #00ffff",
            }}
          >
            Questions
          </Link>
          <Link
            to="/quiz"
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#00ffff",
              color: "#ff00ff",
              textDecoration: "none",
              border: "2px solid #ff00ff",
              borderRadius: "8px",
              fontWeight: "bold",
              textShadow: "1px 1px #000",
              transition: "all 0.2s",
              boxShadow: "0 0 5px #ff00ff",
            }}
          >
            Quiz
          </Link>
        </div>
      </div>

      {/* Footer Note */}
      <p style={{ marginTop: "2rem", color: "#fff", fontSize: "0.8rem", textShadow: "1px 1px #000", textAlign: "center" }}>
        Navigate using the buttons above. Embrace the retro vibes!
      </p>
    </div>
  );
}
