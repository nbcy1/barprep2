import { Link } from "react-router-dom";
// or from "next/link" if using Next.js

export default function Navbar() {
  return (
    <nav className="navbar">
      <h2>BarPrep</h2>
      <div>
        <Link to="/dashboard">Dashboard</Link> |{" "}
        <Link to="/quiz">Quiz</Link> |{" "}
        <Link to="/history">History</Link> |{" "}
        <Link to="/account">Account</Link>
      </div>
    </nav>
  );
}
