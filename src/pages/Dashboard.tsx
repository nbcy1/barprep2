import React, { useState } from "react"
import { generateClient } from "aws-amplify/data"
import type { Schema } from "../amplify/data/resource"

const Dashboard: React.FC = () => {
  const [content, setContent] = useState("")
  const [todos, setTodos] = useState<{ id: string; content: string }[]>([])
  const client = generateClient<Schema>()

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
    <div>
      <h1>Dashboard</h1>
      <input
        type="text"
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="New Todo"
      />
      <button onClick={addTodo}>Add Todo</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.content}
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Dashboard
