import { getPageSession } from "@/server/lucia";
import { BadgePercent, LogOut } from "lucide-react";
// import { usePathname } from 'next/navigation'
import Link from "next/link";
import { redirect } from "next/navigation";
import HeaderLinks from "@/app/_components/header_links";
// import { Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Image from "next/image";

export default async function Header() {
  const session = await getPageSession();

  return (
    <div className="flex flex-row justify-between border-b-2 p-3">
      <Link
        href="/"
        className="inline-flex items-center space-x-2 font-semibold"
      >
        <BadgePercent />
        <h1>OpenAI Demo</h1>
      </Link>
      <HeaderLinks />
      <div className="flex flex-row space-x-2">
        <div className="inline-flex rounded-full border p-2">
          {/* <Avatar>
            <AvatarImage src={session?.user?.avatarUrl} />
            <AvatarFallback>{session.user.githubUsername[0]}</AvatarFallback>
          </Avatar> */}
          {session && <Image src={session?.user?.avatarUrl} width={25} height={10}/>}
          {session && session.user.githubUsername}
          {!session && "No User !"}
        </div>
        {session && (
          <form
            action="/auth/logout"
            method="post"
            className="rounded-full border p-2 pb-0"
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
