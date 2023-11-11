"use client";

import { MarkerLocation } from "@/lib/types";
import { useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
// function getLocation() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(showPosition);
//   } else {
//     x.innerHTML = "Geolocation is not supported by this browser.";
//   }
// }
//
const blueIcon = new L.Icon({
  iconUrl: "/marker-icon-blue.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const redIcon = new L.Icon({
  iconUrl: "/marker-icon-red.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const greenIcon = new L.Icon({
  iconUrl: "/marker-icon-green.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export function LocationMarker({ marker }: { marker: MarkerLocation }) {
  const map = useMap();
  if (marker.property === "main") {
    map.flyTo({ lat: marker.lat, lng: marker.lng }, 13);
  }

  const icon =
    marker.property === "main"
      ? redIcon
      : marker.property === "entertainment"
      ? greenIcon
      : blueIcon;

  return (
    <Marker position={{ lat: marker.lat, lng: marker.lng }} icon={icon}>
      <Popup>{marker.description}</Popup>
    </Marker>
  );
}

export default function MapComponent({
  center,
  markers,
}: {
  center?: { lat: number; lng: number };
  markers?: Array<MarkerLocation>;
}) {
  return (
    <MapContainer
      center={[center?.lat ?? 51.505, center?.lng ?? -0.09]}
      zoom={center ? 13 : 1}
      className="h-[650px] w-[650px] rounded-xl border-2"
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
      />
      {markers?.map((marker, i) => <LocationMarker key={i} marker={marker} />)}
    </MapContainer>
  );
}
