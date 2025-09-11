import { generateClient } from './amplify/data/resource' // <- local file
import type { Schema } from './amplify/data/resource'

// Import your Amplify outputs
import amplifyConfig from './amplify_outputs.json'
import { Amplify } from 'aws-amplify'

Amplify.configure(amplifyConfig)

const client = generateClient<Schema>()

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
      console.error('Error adding question:', q.content, err)
    }
  }
  console.log('Seeding complete!')
}

seed()

