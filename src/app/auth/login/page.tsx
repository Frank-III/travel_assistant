import { getPageSession } from "@/server/lucia";
import Link from "next/link";
import { redirect } from "next/navigation";

// improve this page
const Page = async () => {
  const session = await getPageSession();
  if (session) redirect("/");
  return (
    <div className="flex w-full pl-[20px] h-screen mt-[-69px] items-center justify-center">
    <div className="flex flex-col w-[350px] h-[200px] items-center justify-start border-2 rounded-xl pt-10 space-y-10">
      <h1 className="font">Sign in</h1>
      <Link href="/auth/login/github" className="border px-3 py-2 rounded-xl bg-[#09090B]">
        <button className="text-gray-300">
          Sign in with GitHub
        </button>
      </Link>
    </div>
    </div>
  );
};

export default Page;
