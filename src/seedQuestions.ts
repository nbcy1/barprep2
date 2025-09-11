// src/seedQuestions.ts
import { Amplify } from 'aws-amplify';
import amplifyConfig from './amplify_outputs.json'; // path to your amplify_outputs.json
import { generateClient } from '@aws-amplify/data';
import type { Schema } from './amplify/data/resource';

Amplify.configure(amplifyConfig);

const client = generateClient<Schema>();

// Example questions to seed
const questions = [
  { content: "What is the bar exam passing score?" },
  { content: "Which court is the highest in the U.S.?" },
  { content: "How many hours of study are recommended per day?" },
  { content: "What subjects are covered on the bar exam?" },
  { content: "When are bar exam results released?" },
];

async function seed() {
  for (const q of questions) {
    try {
      await client.models.Todo.create({
        content: q.content,
      });
      console.log('Added question:', q.content);
    } catch (err) {
      console.error('Error adding question:', q.content, 'Error:', err);
    }
  }
  console.log('Seeding complete!');
}

seed();
