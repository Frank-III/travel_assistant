import { type Config } from "drizzle-kit";

import { env } from "@/env.mjs";

export default {
  driver: "pg",
  schema: "./src/server/db/schema.ts",
  dbCredentials: {
    connectionString: env.DATABASE_POOL_URL,
  },
  tablesFilter: ["openai_chat_*"],
} satisfies Config;
