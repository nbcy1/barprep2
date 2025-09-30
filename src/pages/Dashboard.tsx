import React, { useState, useMemo } from "react"
import { generateClient } from "aws-amplify/data"
import type { Schema } from "../amplify/data/resource"

const Dashboard: React.FC = () => {
  const [content, setContent] = useState("")
  const [todos, setTodos] = useState<{ id: string; content: string }[]>([])
  
  // ✅ Move client inside component with useMemo
  const client = useMemo(() => generateClient<Schema>(), [])

  const addTodo = async () => {
    if (!content) return
    try {
      const newTodo = await client.models.Todo.create({ content })
      setTodos(prev => [...prev, newTodo])
      setContent("")
    } catch (err) {
      console.error("Error creating todo:", err)
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      await client.models.Todo.delete({ id })
      setTodos(prev => prev.filter(todo => todo.id !== id))
    } catch (err) {
      console.error("Error deleting todo:", err)
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard</h1>
      <div style={{ marginTop: "1rem" }}>
        <input
          type="text"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="New Todo"
          style={{ padding: "0.5rem", marginRight: "0.5rem" }}
        />
        <button onClick={addTodo} style={{ padding: "0.5rem 1rem" }}>
          Add Todo
        </button>
      </div>
      <ul style={{ marginTop: "2rem" }}>
        {todos.map(todo => (
          <li key={todo.id} style={{ marginBottom: "0.5rem" }}>
            {todo.content}
            <button 
              onClick={() => deleteTodo(todo.id)}
              style={{ marginLeft: "1rem", padding: "0.25rem 0.5rem" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Dashboard
