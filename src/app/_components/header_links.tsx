"use client";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function HeaderLinks() {
  const pathname = usePathname();
  return (
    <div className="inline-flex items-center space-x-3 font-bold text-gray-600 hover:text-gray-800">
      <Link href="/" className={pathname === "/" ? "text-gray-800" : ""}>
        Home
      </Link>
      <Link
        href="/wanderlust"
        className={pathname === "/wanderlust" ? "text-gray-800" : ""}
      >
        Wanderlust
      </Link>
    </div>
  );
}
