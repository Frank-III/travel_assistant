import OpenAI from "openai";
import { env } from "@/env.mjs";

export const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export const assistant = await openai.beta.assistants.create({
  model: "gpt-4-1106-preview",
  name: "Travel Planer",
  instructions:
    "You're a helpful travel assistant that can write and execute code, and has access to a digital map to display information",
  tools: [{ type: "code_interpreter" }, { type: "retrieval" }],
});
