// src/seedQuestions.ts
import Amplify from 'aws-amplify'
import { generateClient } from '../amplify/data/resource'
import type { Schema } from '../amplify/data/resource'

// Load JSON config using require to avoid "assert" syntax issues
const amplifyConfig = require('../src/amplify_outputs.json')

// Configure Amplify
Amplify.configure(amplifyConfig)

// Generate Data client
const client = generateClient<Schema>()

// Sample questions to seed
const questions = [
  { question: 'What is the bar exam passing score?', answer: 'Typically 270 out of 400 points, varies by state.' },
  { question: 'Which court is the highest in the U.S.?', answer: 'The Supreme Court of the United States.' },
  { question: 'What is the difference between civil and criminal law?', answer: 'Civil law deals with disputes between private parties, criminal law deals with offenses against the state.' },
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


