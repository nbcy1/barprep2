"use client"

import React, { useEffect, useState } from "react"
import { generateClient } from "aws-amplify/data"
import type { Schema } from "../amplify/data/resource"

const client = generateClient<Schema>()

interface Todo {
  id: string
  content: string
}

export default function History() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await client.models.Todo.list()
        setTodos(response)
      } catch (error) {
        console.error("Error fetching todos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTodos()
  }, [])

  if (loading) return <p>Loading...</p>
  if (!todos.length) return <p>No items found.</p>

  return (
    <div>
      <h1>History</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.content}</li>
        ))}
      </ul>
    </div>
  )
}
