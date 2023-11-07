import { getPageSession } from "@/server/lucia";
import { redirect } from "next/navigation";

// improve this page
const Page = async () => {
  const session = await getPageSession();
  if (session) redirect("/");
  return (
    <>
      <h1>Sign in</h1>
      <a href="/auth/login/github">Sign in with GitHub</a>
    </>
  );
};

export default Page;
