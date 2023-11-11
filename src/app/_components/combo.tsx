"use client";
import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import MapComponent, { LocationMarker } from "@/app/_components/map-container";
import { useCoords } from "@/hooks/useCoords";
import ChatBox from "../_components/chat_ai";
import { MarkerLocation } from "@/lib/types";
import { Message } from "@/lib/types";

export default function Combo() {
  const coords = useCoords();
  const [markers, setMarkers] = useState<MarkerLocation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const addMessages = (newMessages: Message[]) => {
    setMessages([...messages, ...newMessages]);
  };
  const addmarkers = (newMarkers: MarkerLocation[]) => {
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
    <div className="flex h-screen max-h-screen over-flow-hidden w-full flex-row items-center justify-center space-x-10">
      
      <ChatBox addMarker={addmarkers} addMessages={addMessages} messages={messages}/>
      <MapComponent markers={markers} />
    </div>
  );
}
