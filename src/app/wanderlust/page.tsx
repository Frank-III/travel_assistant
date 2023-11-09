import { getPageSession } from "@/server/lucia";
import { redirect } from "next/navigation";
import Combo from "@/app/_components/combo";

export default async function Page() {
  const session = await getPageSession();
  if (!session) redirect("/auth/login");
  console.log(session)
  return (
    <div>
      <Combo />
    </div>
  );
}
