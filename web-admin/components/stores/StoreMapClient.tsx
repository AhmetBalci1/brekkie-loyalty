"use client";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
import {
  MapContainer,
  Marker,
  TileLayer,
  useMapEvents,
} from "react-leaflet";

type Props = {
  latitude: number;
  longitude: number;
  onLocationChange: (
    lat: number,
    lng: number
  ) => void;
};

function LocationMarker({
  latitude,
  longitude,
  onLocationChange,
}: Props) {
  useMapEvents({
    click(e) {
      onLocationChange(
        e.latlng.lat,
        e.latlng.lng
      );
    },
  });

  return (
    <Marker
      position={[
        latitude,
        longitude,
      ]}
    />
  );
}

export default function StoreMapClient({
  latitude,
  longitude,
  onLocationChange,
}: Props) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={16}
      className="h-[350px] w-full rounded-xl"
    >
      <TileLayer
        attribution="OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocationMarker
        latitude={latitude}
        longitude={longitude}
        onLocationChange={onLocationChange}
      />
    </MapContainer>
  );
}