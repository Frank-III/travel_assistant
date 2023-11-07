import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

import { openai, assistant } from "@/server/openai_assistant";

export const travelRouter = createTRPCRouter({
  // TODO: add user location here (or in the ctx)
  ask: protectedProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const message = await openai.beta.threads.messages.create(
        ctx.session?.userId,
        {
          role: "user",
          content: input.text,
        },
      );
      let run = await openai.beta.threads.runs.create(message.id, {
        assistant_id: assistant.id,
        instructions:
          "1. if the user ask about visit place, return the location of each place in the map, with notations. 2. if the user ask about the weather, return the weather of the place. 3. if the user ask about the travel plan, return the travel plan. 4. if the user ask about the travel time, return the travel time. 5. if the user ask about the travel cost, return the travel cost. 6. if the user ask about the travel distance, return the travel distance. 7. if the user ask about the travel route, return the travel route. 8. if the user ask about travel or costs that include calculations use code interpreter to do the calculation",
      });

      // periodically retrieve the Run to check on its status to see if it has moved to completed.
      while (
        (await openai.beta.threads.runs.retrieve(message.id, run.id)).status !==
        "completed"
      ) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      const messages = await openai.beta.threads.messages.list(message.id);
      return messages;
    }),
});
