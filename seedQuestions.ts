import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "./amplify/data/resource";
import fs from "fs";

// Import your Gen 2 backend outputs
import amplifyConfig from "./amplify/amplify_outputs.json";

// Tell Amplify about your backend
Amplify.configure(amplifyConfig);

const questions = JSON.parse(fs.readFileSync("./questions.json", "utf-8"));

async function seed() {
  const client = generateClient<Schema>();

  for (const q of questions) {
    try {
      await client.models.Todo.create(q); // <-- use your model name
      console.log(`Added question: ${q.content}`);
    } catch (err) {
      console.error("Error adding question:", q.content, err);
    }
  }

  console.log("Seeding complete!");
}

seed().catch(console.error);
