import { generateClient } from "aws-amplify/data";
import type { Schema } from "./amplify/data/resource";
import fs from "fs";

const questions = JSON.parse(fs.readFileSync("./questions.json", "utf-8"));

async function seed() {
  const client = generateClient<Schema>();

  for (const q of questions) {
    try {
      await client.models.Question.create(q);
      console.log(`Added question: ${q.content}`);
    } catch (err) {
      console.error("Error adding question:", q.content, err);
    }
  }

  console.log("Seeding complete!");
}

seed().catch(console.error);
