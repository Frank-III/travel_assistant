import Link from "next/link";
import { CreatePost } from "@/app/_components/create-post";
import { getPageSession } from "@/server/lucia";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";

export default async function Home() {
  const session = await getPageSession();

  if (!session) redirect("/auth/login");

  const hello = await api.post.hello.query({ text: "from tRPC" });

  return (
    <main className="">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
        </h1>
        <p>Hello, {session.user.githubUsername}</p>
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-white">
            {hello ? hello.greeting : "Loading tRPC query..."}
          </p>
        </div>

        <CrudShowcase />
      </div>
    </main>
  );
}

async function CrudShowcase() {
  const latestPost = await api.post.getLatest.query();

  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <CreatePost />
    </div>
  );
}
