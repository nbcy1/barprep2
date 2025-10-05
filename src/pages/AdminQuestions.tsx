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

  const client = useMemo(() => generateClient(), []);

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
        authMode: "API_KEY", // ✅ use API key for public read
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
    if (!newQuestion.question || !newQuestion.answer || !newQuestion.topic) {
      alert("Please fill in question, answer, and topic");
      return;
    }

    const filledChoices = newQuestion.choices.filter(c => c.trim() !== "");
    if (filledChoices.length < 2) {
      alert("Please provide at least 2 choices");
      return;
    }

    if (!filledChoices.includes(newQuestion.answer)) {
      alert("The correct answer must be one of the choices");
      return;
    }

    try {
      // Make sure user is signed in
      await Auth.currentAuthenticatedUser();

      const input: any = {
        question: newQuestion.question,
        choices: filledChoices,
        answer: newQuestion.answer,
        topic: newQuestion.topic,
      };

      if (newQuestion.explanation.trim()) {
        input.explanation = newQuestion.explanation;
      }

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
        authMode: "AMAZON_COGNITO_USER_POOLS", // ✅ must be signed in
      });
      
      setNewQuestion({ question: "", choices: ["", "", "", ""], answer: "", explanation: "", topic: "" });
      fetchQuestions();
      alert("Question added successfully!");
    } catch (err) {
      console.error("Error adding question:", err);
      alert("Error adding question. Make sure you are signed in.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    
    try {
      // Make sure user is signed in
      await Auth.currentAuthenticatedUser();

      await client.graphql({
        query: `
          mutation DeleteQuestion($input: DeleteQuestionInput!) {
            deleteQuestion(input: $input) {
              id
            }
          }
        `,
        variables: { input: { id } },
        authMode: "AMAZON_COGNITO_USER_POOLS", // ✅ must be signed in
      });
      setQuestions(prev => prev.filter(q => q.id !== id));
    } catch (err) {
      console.error("Error deleting question:", err);
      alert("Error deleting question. Make sure you are signed in.");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Admin - Manage Questions</h1>
      {/* ...rest of your JSX unchanged */}
    </div>
  );
}

