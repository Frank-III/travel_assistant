import OpenAI from "openai";
import { env } from "@/env.mjs";

export const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export const assistant = env.ASSISTANT_ID
  ? await openai.beta.assistants.retrieve(env.ASSISTANT_ID)
  : await openai.beta.assistants.create({
      model: "gpt-4-1106-preview",
      name: "Travel Planer",
      instructions:
        "You're a helpful travel assistant that can write and execute code, and has access to a digital map to display information, if your answer contains a place, you should always give the location and mark on the digital map",
      tools: [
        { type: "code_interpreter" },
        { type: "retrieval" },
        {
          type: "function",
          function: {
            name: "mark_location",
            parameters: {
              type: "object",
              properties: {
                locations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      lat: {
                        type: "number",
                        description: "latitude",
                      },
                      lng: {
                        type: "number",
                        description: "longitude",
                      },
                      description: {
                        type: "string",
                      },
                      property: {
                        enum: ["main", "entertainment", "landscape"],
                        description:
                          "entertainments stand for places to eat or entertain, and landscape is visiting places, and main is the place you are travelling for",
                      },
                    },
                  },
                },
              },
              required: ["locations"],
            },
            description:
              "given a list of locations, mark them on the map and return the map",
          },
        },
      ],
    });
