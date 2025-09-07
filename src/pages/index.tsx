import { withAuthenticator } from "@aws-amplify/ui-react";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <>
      <Navbar />
      <main className="page">
        <h1>Welcome to BarPrep</h1>
        <p>Practice bar exam questions, track progress, and improve weak areas.</p>
      </main>
    </>
  );
}

export default withAuthenticator(Home);
