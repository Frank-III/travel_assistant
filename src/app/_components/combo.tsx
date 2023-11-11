"use client";
import { useEffect, useState } from "react";
import MapComponent from "@/app/_components/map-container";
import { useCoords } from "@/hooks/useCoords";
import ChatBox from "../_components/chat_ai";
import { type MarkerLocationWithCenter, type Message } from "@/lib/types";
import ExportButton from "@/app/_components/export_button";

export default function Combo() {
  const coords = useCoords();
  const [markers, setMarkers] = useState<MarkerLocationWithCenter[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const addMessages = (newMessages: Message[]) => {
    setMessages([...messages, ...newMessages]);
  };
  const addmarkers = (newMarkers: MarkerLocationWithCenter[]) => {
    setMarkers([...markers, ...newMarkers]);
  };

  useEffect(() => {
    if (coords) {
      console.log(coords);
      addmarkers([
        {
          lat: coords.latitude,
          lng: coords.longitude,
          description: "You are here",
          property: "main",
        },
      ]);
    }
  }, [coords]);

  return (
    <>
      <div className="inline-flex w-full justify-end">
        <ExportButton content={{ messages: messages, locations: markers }} />
      </div>
      {/* FIXME: mt-[-124px] not a good thing*/}
      <div className="over-flow-hidden mt-[-125px] flex h-screen w-full flex-row items-center justify-center space-x-10">
        <ChatBox
          addMarker={addmarkers}
          addMessages={addMessages}
          messages={messages}
        />
        <MapComponent markers={markers} />
      </div>
    </>
  );
}
