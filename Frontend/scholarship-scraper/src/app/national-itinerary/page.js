'use client';

import { useState, useEffect } from 'react';
import ItineraryList from './ItineraryList';
import FullItinerary from './FullItinerary';
import CurrentEvent from './CurrentEvent';
import BackToNational from '../components/BackToNational';
import LoadingSpinner from '../components/Loading';
import EmergencyFooter from '../components/Footer';

export default function Itinerary() {
    const [itinerary, setItinerary] = useState(null);
    const [selectedView, setSelectedView] = useState("live");
    const [currentDate, setCurrentDate] = useState("");
    const [currentTime, setCurrentTime] = useState(new Date());
    const [currentEvent, setCurrentEvent] = useState(null);
    const [nextEvent, setNextEvent] = useState(null);
    const [countdown, setCountdown] = useState("");

    // ✅ Fetch itinerary data only when the component mounts
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/itinerary');
                const data = await response.json();
                if (data.success && data.data) {
                    setItinerary(data.data);
                } else {
                    console.error("No itinerary data available.");
                    setItinerary({ schedule: {} }); // Prevent crashes
                }
            } catch (error) {
                console.error("Error fetching itinerary:", error);
                setItinerary({ schedule: {} });
            }
        }
        fetchData();
    }, []);

    // ✅ Sync real-time clock
    useEffect(() => {
        setCurrentDate(new Date().toLocaleString("en-US", { month: "long", day: "numeric" }));

        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // ✅ Determine current & next event
    useEffect(() => {
        if (!itinerary || !currentDate || !itinerary.schedule[currentDate]) return;

        const eventsToday = itinerary.schedule[currentDate]?.timeline || [];
        if (eventsToday.length === 0) {
            setCurrentEvent(null);
            setNextEvent(null);
            setCountdown("No more events today");
            return;
        }

        let now = currentTime.getHours() * 60 + currentTime.getMinutes();
        let current = null;
        let next = null;

        for (let event of eventsToday) {
            const startTime = parseTime(event.time || event.departure_time);
            const endTime = event.end_time ? parseTime(event.end_time) : startTime + 60;

            if (now >= startTime && now < endTime) {
                current = event;
            } else if (now < startTime && !next) {
                next = event;
            }
        }

        setCurrentEvent(current);
        setNextEvent(next);

        if (next) {
            const diffMinutes = parseTime(next.time || next.departure_time) - now;
            setCountdown(`${Math.floor(diffMinutes / 60)}h ${diffMinutes % 60}m`);
        } else {
            setCountdown("No more events today");
        }
    }, [currentTime, itinerary, currentDate]);

    function parseTime(timeStr) {
        if (!timeStr) return 0;
        const parts = timeStr.match(/(\d+):?(\d+)?\s?(AM|PM)?/);
        if (!parts) return 0;

        let hour = parseInt(parts[1], 10);
        let minute = parts[2] ? parseInt(parts[2], 10) : 0;
        const isPM = parts[3] === "PM";

        return (hour % 12 + (isPM ? 12 : 0)) * 60 + minute;
    }

    // 🚨 Prevent rendering if itinerary is not loaded yet
    if (!itinerary || !itinerary.schedule) {
        return <LoadingSpinner />;
    }

    return (
        <>
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
            <BackToNational />

            {/* Display Current Event */}
            <CurrentEvent 
                currentEvent={currentEvent} 
                nextEvent={nextEvent} 
                countdown={countdown} 
                currentTime={currentTime} 
            />

            {/* View Toggle Buttons */}
            <div className="flex space-x-4 mb-6 mt-4">
                <button
                    onClick={() => setSelectedView("live")}
                    className={`w-1/2 px-4 py-2 rounded-lg font-medium transition ${
                        selectedView === "live" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                    }`}
                >
                    🔴 Live Schedule
                </button>
                <button
                    onClick={() => setSelectedView("full")}
                    className={`w-1/2 px-4 py-2 rounded-lg font-medium transition ${
                        selectedView === "full" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-800"
                    }`}
                >
                    📖 Full Itinerary
                </button>
            </div>

            {/* Conditionally Render Views */}
            {selectedView === "live" ? (
                <ItineraryList 
                    itinerary={itinerary} 
                    currentDate={currentDate} 
                    currentEvent={currentEvent} 
                    nextEvent={nextEvent} 
                    countdown={countdown} 
                    currentTime={currentTime} 
                />
            ) : (
                <FullItinerary itinerary={itinerary} currentDate={currentDate} />
            )}
             <EmergencyFooter />
        </div>
       
        </>
    );
}
