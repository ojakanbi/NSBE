'use client';
import { useEffect, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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

  useEffect(() => {
    async function fetchBusData() {
      try {
        const response = await fetch("/api/transit");
        const data = await response.json();
        if (data.data) {
          setBusData(data.data);
          console.log("🚌 Bus data fetched:", data.data);
        }
      } catch (error) {
        console.error("Error fetching bus data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBusData();
    const interval = setInterval(fetchBusData, process.env.NEXT_PUBLIC_CACHE_EXPIRATION * 1000 || 300000);
    return () => clearInterval(interval);
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <BackToNational />
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          🚌 Next Buses from Hotel to Convention Center
        </h2>

        {loading ? (
            <LoadingSpinner />
        ) : busData.length === 0 ? (
          <p className="text-gray-500 text-center mt-4">No buses available.</p>
        ) : (
          <>
            {/* Google Maps */}
            <GoogleMap mapContainerStyle={mapContainerStyle} center={stopLocation} zoom={14}>
              <Marker position={hotelLocation} label="🏨 Hotel" />
              <Marker position={stopLocation} label="🚌 Bus Stop" />
              <Marker position={conventionCenter} label="🏛️ Convention Center" />
            </GoogleMap>

            {/* Bus Schedule Carousel */}
            <Slider {...sliderSettings} className="mt-6">
              {busData.map((bus, index) => (
                <div key={index} className="p-4 bg-gray-100 rounded-lg shadow-md text-center">
                  <h2 className="text-xl font-bold text-blue-600">
                    {bus.route_short_name} - {bus.route_name}
                  </h2>
                  <p className="text-gray-600">
                    🚏 Stop:{" "}
                    <a href={bus.google_maps_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                      {bus.stop_name}
                    </a>
                  </p>
                  <p className="text-gray-600">📍 Direction: {bus.headsign}</p>
                  <p className="text-gray-600">🕒 Estimated Travel Time: ~12 min</p>
                  <p className="text-gray-600">
                    ⏳ Departure:{" "}
                    <span className="font-semibold text-green-600">
                      {new Date(bus.departure_time * 1000).toLocaleTimeString("en-US", {
                        timeZone: "America/Chicago",
                      }).replace(/:\d+ /, ' ')}
                    </span>
                  </p>
                </div>
              ))}
            </Slider>
          </>
        )}
      </div>
      <EmergencyFooter />
    </div>
  );
}
