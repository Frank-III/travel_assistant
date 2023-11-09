import { type ClassValue, clsx } from "clsx";
import { openai } from "@/server/openai_assistant";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function retrieveRunRes(message_id: string, run_id: string) {
  let run;
  while (
    (run = await openai.beta.threads.runs.retrieve(message_id, run_id))
      .status !== "completed"
  ) {
    // check error
    if (run.status === "failed") {
      throw "OpenAI Assistant Error";
    }
    if (run.status === "requires_action") {
      return { type: "action", action: run };
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  const messages = await openai.beta.threads.messages.list(message_id);
  return { type: "message", messages: messages };
}
