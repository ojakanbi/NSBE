"use client";
import { LoadScriptNext } from "@react-google-maps/api";

const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function GoogleMapsProvider({ children }) {
  return (
    <LoadScriptNext googleMapsApiKey={MAPS_API_KEY} loadingElement={<p>Loading Maps...</p>}>
      {children}
    </LoadScriptNext>
  );
}
