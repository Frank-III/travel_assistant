import { drizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig, Pool } from "@neondatabase/serverless";

import { env } from "@/env.mjs";
import * as schema from "./schema";

neonConfig.fetchConnectionCache = true;

export const http = neon(env.DATABASE_URL);
export const pool = new Pool({ connectionString: env.DATABASE_POOL_URL });

export const db = drizzle(http, { schema });
