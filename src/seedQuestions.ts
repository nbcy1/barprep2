// src/seedQuestions.ts
import { Amplify } from 'aws-amplify'
import amplifyConfig from './aws-exports' // adjust if your aws-exports is elsewhere

import { generateClient } from 'aws-amplify/data'
import type { Schema } from './amplify/data/resource'

// Configure Amplify
Amplify.configure(amplifyConfig)

// Generate Data client
const client = generateClient<Schema>()

// Questions to seed
const questions = [
  { content: 'What is the bar exam passing score?' },
  { content: 'Which court is the highest in the U.S.?' },
  { content: 'How many U.S. Supreme Court justices are there?' },
  { content: 'What is the statute of limitations for contracts in your state?' }
]

async function seed() {
  for (const q of questions) {
    try {
      await client.models.Todo.create(q)
      console.log('Added question:', q.content)
    } catch (err) {
      console.error('Error adding question:', q.content, 'Error:', err)
    }
  }
  console.log('Seeding complete!')
}

seed()
