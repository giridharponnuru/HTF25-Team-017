import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({ onSelect }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition({ lat, lng });
      onSelect({ lat, lng }); // send location to parent component
    },
  });

  return position === null ? null : <Marker position={position} icon={markerIcon} />;
}

export default function MapPicker({ onSelect }) {
  return (
    <div style={{ height: "250px", width: "100%", borderRadius: "10px", overflow: "hidden" }}>
      <MapContainer
        center={[17.385, 78.4867]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        />
        <LocationMarker onSelect={onSelect} />
      </MapContainer>
    </div>
  );
}
