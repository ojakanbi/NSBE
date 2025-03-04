"use client";

import { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { motion, AnimatePresence } from "framer-motion";
import BackToNational from "../components/BackToNational";
import LoadingSpinner from "../components/Loading";
import EmergencyFooter from "../components/Footer";

const stopLocation = { lat: 41.86915324015468, lng: -87.62397287426343 }; // Michigan & 11th Street
const hotelLocation = { lat: 41.8719, lng: -87.6246 }; // Approx. hotel location
const conventionCenter = { lat: 41.8512, lng: -87.6176 }; // McCormick Place
const mapContainerStyle = { width: "100%", height: "400px", borderRadius: "10px" };

export default function BusSchedule() {
  const [busData, setBusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Google Maps API Loader
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    async function fetchBusData() {
      try {
        const response = await fetch("/api/transit");
        if (!response.ok) throw new Error("Failed to fetch bus data.");
        const data = await response.json();
        if (data.data) {
          setBusData(data.data);
          console.log("🚌 Bus data fetched:", data.data);
        } else {
          throw new Error("No bus data available.");
        }
      } catch (error) {
        console.error("Error fetching bus data:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBusData();
    const interval = setInterval(fetchBusData, process.env.NEXT_PUBLIC_CACHE_EXPIRATION * 1000 || 300000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % busData.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + busData.length) % busData.length);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <BackToNational />
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          🚌 Next Buses from Hotel to Convention Center
        </h2>

        {/* 🔄 Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-40">
            <LoadingSpinner />
            <p className="text-gray-500 mt-2">Loading bus schedules...</p>
          </div>
        )}

        {/* ❌ Error State */}
        {error && !loading && (
          <div className="text-center text-red-500 mt-4">
            <p>⚠️ {error}</p>
          </div>
        )}

        {/* ✅ Bus Data Display */}
        {!loading && !error && busData.length === 0 && (
          <p className="text-gray-500 text-center mt-4">No buses available.</p>
        )}

        {!loading && !error && busData.length > 0 && (
          <>
            {/* Google Maps (Only Render When Loaded) */}
            {isLoaded ? (
              <GoogleMap mapContainerStyle={mapContainerStyle} center={stopLocation} zoom={14}>
                <Marker position={hotelLocation} label="🏨 Hotel" />
                <Marker position={stopLocation} label="🚌 Bus Stop" />
                <Marker position={conventionCenter} label="🏛️ Convention Center" />
              </GoogleMap>
            ) : (
              <div className="text-gray-500 text-center mt-4">📍 Loading map...</div>
            )}

            {/* Custom Bus Schedule Carousel */}
            <div className="relative w-full mt-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="p-4 bg-gray-100 rounded-lg shadow-md text-center"
                >
                  <h2 className="text-xl font-bold text-blue-600">
                    {busData[currentIndex].route_short_name} - {busData[currentIndex].route_name}
                  </h2>
                  <p className="text-gray-600">
                    🚏 Stop:{" "}
                    <a href={busData[currentIndex].google_maps_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                      {busData[currentIndex].stop_name}
                    </a>
                  </p>
                  <p className="text-gray-600">📍 Direction: {busData[currentIndex].headsign}</p>
                  <p className="text-gray-600">🕒 Estimated Travel Time: ~12 min</p>
                  <p className="text-gray-600">
                    ⏳ Departure:{" "}
                    <span className="font-semibold text-green-600">
                      {new Date(busData[currentIndex].departure_time * 1000).toLocaleTimeString("en-US", {
                        timeZone: "America/Chicago",
                      }).replace(/:\d+ /, ' ')}
                    </span>
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Carousel Navigation */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={prevSlide}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition"
                >
                  ◀ Prev
                </button>
                <button
                  onClick={nextSlide}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition"
                >
                  Next ▶
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <EmergencyFooter />
    </div>
  );
}

