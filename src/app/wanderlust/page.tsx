import { getPageSession } from "@/server/lucia";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
// const MapComponent = dynamic(() => import("@/app/_components/map-container"));
import MapComponent, { LocationMarker } from "@/app/_components/map-container";
import ChatBox from "../_components/chat_ai";

export default async function Page() {
  const session = await getPageSession();
  if (!session) redirect("/auth/login");

  return (
    <main>
      <div className="flex h-screen w-full flex-row items-center justify-center space-x-10">
        <ChatBox />
        <MapComponent>
          <LocationMarker />
        </MapComponent>
      </div>
    </main>
  );
}
