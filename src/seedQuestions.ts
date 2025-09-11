// src/seedQuestions.ts
import { Amplify } from 'aws-amplify';
import amplifyConfig from '../amplify/amplify_outputs.json'; // relative to src/
import { generateClient } from '@aws-amplify/data';
import type { Schema } from '../amplify/data/resource'; // relative path to resource.ts
import questionsData from './questions.json'; // your questions JSON file

// Configure Amplify
Amplify.configure(amplifyConfig);

// Generate Data client
const client = generateClient<Schema>();

async function seed() {
  for (const q of questionsData) {
    try {
      await client.models.Question.create({
        question: q.question,
        choices: q.choices,
        answer: q.answer,
        topic: q.topic,
      });
      console.log(`Added question: ${q.question}`);
    } catch (err) {
      console.error(`Error adding question: ${q.question}`, err);
    }
  }
}

seed()
  .then(() => console.log('Seeding complete!'))
  .catch((err) => console.error('Seeding failed:', err));
