import { cn } from "@/lib/utils";
import { getPageSession } from "@/server/lucia";
import { BadgePercent, LogOut } from "lucide-react";
// import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { redirect } from "next/navigation";


export default async function Header() {
  const session = await getPageSession();

  return (
    <div className="flex flex-row justify-between p-3 border-b-2">
      <Link href="/" className="inline-flex space-x-2 items-center font-semibold">
        <BadgePercent />
        <h1>OpenAI Demo</h1>
      </Link>

      <div className="inline-flex space-x-3 items-center font-bold text-gray-700 hover:text-gray-800">
        <Link href="/" >Home</Link>
        <Link href="/wanderlust" >Wanderlust</Link>
      </div>
      {/* <HeaderLinks /> */}
      <div className="flex flex-row space-x-2">
        <div className="rounded-full border p-2">
          {session && session.user.githubUsername}
        </div>
         {session && (
           <form
             action="/auth/logout"
             method="post"
             className="rounded-full border  p-2 pb-0"
           >
             <button type="submit">
               <LogOut size={18} />
             </button>
          </form>
         )}
       </div>
    </div>
  );
}

