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

// function getLocation() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(showPosition);
//   } else {
//     x.innerHTML = "Geolocation is not supported by this browser.";
//   }
// }
//

export function LocationMarker({marker}: {marker: MarkerLocation}) {
  const map = useMap()
  if (marker.center) {
  map.flyTo({lat: marker.lat, lng: marker.lng}, 13);
  }

  return (<Marker position={{lat: marker.lat, lng: marker.lng}}>
    <Popup>{marker.description}</Popup>
  </Marker>
  );
}

export default function MapComponent({
  center,
  markers,
}: {
  center?: { lat: number; lng: number } ;
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
      {markers?.map(( marker, i) => (
        <LocationMarker key={i} marker={marker}/>
      ))}
    </MapContainer>
  );
}
