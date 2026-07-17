"use client";

import dynamic from "next/dynamic";

const StoreMapClient = dynamic(
  () => import("./StoreMapClient"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[350px] flex items-center justify-center rounded-xl border">
        Harita yükleniyor...
      </div>
    ),
  }
);

type Props = {
  latitude: number;
  longitude: number;
  onLocationChange: (
    lat: number,
    lng: number
  ) => void;
};

export default function StoreMap(props: Props) {
  return <StoreMapClient {...props} />;
}