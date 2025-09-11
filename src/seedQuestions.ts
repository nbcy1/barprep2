// src/seedQuestions.ts
import { generateClient } from '../amplify/data/resource'
import type { Schema } from '../amplify/data/resource'
import Amplify from 'aws-amplify'
import amplifyConfig from './amplify_outputs.json' assert { type: 'json' }

// Configure Amplify with your Gen 2 backend
Amplify.configure(amplifyConfig)

const client = generateClient<Schema>()

// Example questions to seed
const questions = [
  {
    question: 'What is the bar exam passing score?',
    answer: 'Typically 270 out of 400 points, varies by state.',
  },
  {
    question: 'Which court is the highest in the U.S.?',
    answer: 'The Supreme Court of the United States.',
  },
]

async function seed() {
  for (const q of questions) {
    try {
      await client.models.Question.create(q)
      console.log(`Added question: ${q.question}`)
    } catch (err) {
      console.error(`Error adding question: ${q.question}`, err)
    }
  }
}

seed().then(() => console.log('Seeding complete!'))


