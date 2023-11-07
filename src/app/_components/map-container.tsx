"use client";

import { useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";

// function getLocation() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(showPosition);
//   } else {
//     x.innerHTML = "Geolocation is not supported by this browser.";
//   }
// }
//

export function LocationMarker() {
  const [pos, setPos] = useState<{ lat: number; lng: number }>({
    lat: 51.505,
    lng: -0.09,
  });

  const map = useMapEvents({
    click() {
      map.locate();
    },
    locationfound(e) {
      setPos(e.latlng);
      map.flyTo(e.latlng, 13);
    },
  });
  return pos === null ? null : (
    <Marker position={pos}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

export default function MapComponent({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={1}
      className="h-[650px] w-[650px] rounded-xl border-2"
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  );
}
