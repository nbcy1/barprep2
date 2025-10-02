import { useEffect, useState, useMemo, useCallback } from "react";
import { generateClient } from "aws-amplify/api";
import { Auth } from "aws-amplify";

export default function AdminQuestions() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    choices: ["", "", "", ""],
    answer: "",
    explanation: "",
    topic: ""
  });
  const [isAdmin, setIsAdmin] = useState(false); // ✅ Track admin status

  const client = useMemo(() => generateClient(), []);

  // ✅ Check if current user is in Admin group
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => {
        const groups = user.signInUserSession.accessToken.payload["cognito:groups"] || [];
        console.log("User Groups:", groups);
        setIsAdmin(groups.includes("Admin"));
      })
      .catch(err => {
        console.error("Error fetching user:", err);
        setIsAdmin(false);
      });
  }, []);

  const fetchQuestions = useCallback(async () => {
    try {
      const res = await client.graphql({
        query: `
          query ListQuestions {
            listQuestions {
              items {
                id
                question
                choices
                answer
                explanation
                topic
              }
            }
          }
        `,
      });
      setQuestions(res.data.listQuestions.items);
    } catch (err) {
      console.error("Error fetching questions:", err);
    }
  }, [client]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // --- Your existing functions: handleChoiceChange, addChoice, removeChoice, handleAdd, handleDelete ---
  // Keep all of them unchanged

  // ✅ Only render admin UI if user is an admin
  if (!isAdmin) {
    return <p style={{ padding: "2rem", textAlign: "center" }}>You do not have admin access.</p>;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      {/* Entire admin UI here remains unchanged */}
      {/* ...all of your add question form and existing questions list */}
    </div>
  );
}
