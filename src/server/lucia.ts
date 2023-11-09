// lucia.ts
import { nextjs_future } from "lucia/middleware";
import { github } from "@lucia-auth/oauth/providers";
import { lucia, type Session } from "lucia";
import { pg } from "@lucia-auth/adapter-postgresql";
import { cache } from "react";
import { pool } from "./db/index";
import { env } from "@/env.mjs";
import * as context from "next/headers";

export const auth = lucia({
  adapter: pg(pool, {
    user: "openai_chat_auth_user",
    session: "openai_chat_user_session",
    key: "openai_chat_user_key",
  }),
  env: env.NODE_ENV === "development" ? "DEV" : "PROD",
  middleware: nextjs_future(),
  getUserAttributes: (data) => {
    return {
      githubUsername: data.username,
      avatarUrl: data.avatar_url,
    };
  },
});

export const githubAuth = github(auth, {
  clientId: env.GITHUB_CLIENT_ID ?? "",
  clientSecret: env.GITHUB_CLIENT_SECRET ?? "",
});

export type Auth = typeof auth;

export const getPageSession = cache<() => Promise<Session>>(async () => {
  const authRequest = auth.handleRequest("GET", context);
  return authRequest.validate();
});
