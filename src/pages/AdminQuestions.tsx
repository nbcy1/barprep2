import { useEffect, useState, useMemo, useCallback } from "react";
import { generateClient } from "aws-amplify/api";
import { Amplify, Auth } from "aws-amplify";
import awsExports from "../aws-exports";

Amplify.configure(awsExports);

interface Question {
  id: string;
  question: string;
  choices: string[];
  answer: string;
  explanation?: string;
  topic: string;
}

export default function AdminQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    choices: ["", "", "", ""],
    answer: "",
    explanation: "",
    topic: "",
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  const client = useMemo(() => generateClient(), []);

  // Check if current user is in Admin group
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        const groups = user.signInUserSession.accessToken.payload["cognito:groups"] || [];
        setIsAdmin(groups.includes("Admin")); // <-- only "Admin" group
      })
      .catch((err) => console.error("Error getting user info:", err))
      .finally(() => setLoadingUser(false));
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

  const handleChoiceChange = (index: number, value: string) => {
    const updatedChoices = [...newQuestion.choices];
    updatedChoices[index] = value;
    setNewQuestion({ ...newQuestion, choices: updatedChoices });
  };

  const addChoice = () => {
    setNewQuestion({ ...newQuestion, choices: [...newQuestion.choices, ""] });
  };

  const removeChoice = (index: number) => {
    if (newQuestion.choices.length <= 2) {
      alert("You must have at least 2 choices");
      return;
    }
    const updatedChoices = newQuestion.choices.filter((_, i) => i !== index);
    setNewQuestion({ ...newQuestion, choices: updatedChoices });
  };

  const handleAdd = async () => {
    if (!isAdmin) return alert("You are not authorized to add questions");

    if (!newQuestion.question || !newQuestion.answer || !newQuestion.topic) {
      alert("Please fill in question, answer, and topic");
      return;
    }

    const filledChoices = newQuestion.choices.filter((c) => c.trim() !== "");
    if (filledChoices.length < 2) {
      alert("Please provide at least 2 choices");
      return;
    }

    if (!filledChoices.includes(newQuestion.answer)) {
      alert("The correct answer must be one of the choices");
      return;
    }

    try {
      const input: any = {
        question: newQuestion.question,
        choices: filledChoices,
        answer: newQuestion.answer,
        topic: newQuestion.topic,
      };
      if (newQuestion.explanation.trim()) input.explanation = newQuestion.explanation;

      await client.graphql({
        query: `
          mutation CreateQuestion($input: CreateQuestionInput!) {
            createQuestion(input: $input) {
              id
              question
              choices
              answer
              explanation
              topic
            }
          }
        `,
        variables: { input },
      });

      setNewQuestion({ question: "", choices: ["", "", "", ""], answer: "", explanation: "", topic: "" });
      fetchQuestions();
      alert("Question added successfully!");
    } catch (err) {
      console.error("Error adding question:", err);
      alert("Error adding question");
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) return alert("You are not authorized to delete questions");
    if (!confirm("Are you sure you want to delete this question?")) return;

    try {
      await client.graphql({
        query: `
          mutation DeleteQuestion($input: DeleteQuestionInput!) {
            deleteQuestion(input: $input) {
              id
            }
          }
        `,
        variables: { input: { id } },
      });
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      console.error("Error deleting question:", err);
    }
  };

  if (loadingUser) return <p>Loading...</p>;

  if (!isAdmin) return <p>You do not have admin access.</p>;

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Admin - Manage Questions</h1>
      {/* Add question form */}
      {/* Existing questions */}
      {/* ...copy the rest of your form/UI here */}
    </div>
  );
}

