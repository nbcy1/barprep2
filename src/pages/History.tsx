"use client"

import React, { useEffect, useState, useMemo } from "react"
import { generateClient } from "aws-amplify/data"
import type { Schema } from "../amplify/data/resource"

interface Todo {
  id: string
  content: string
}

export default function History() {
  // ✅ Move client inside component with useMemo
  const client = useMemo(() => generateClient<Schema>(), [])
  
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
  }, [client])

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
