'use client';

import { useState, useEffect } from 'react';
import ItineraryList from './ItineraryList';
import FullItinerary from './FullItinerary';
import CurrentEvent from './CurrentEvent';
import BackToNational from '../components/BackToNational';

export default function Itinerary() {
    const [itinerary, setItinerary] = useState(null);
    const [selectedView, setSelectedView] = useState("live");
    const [currentDate, setCurrentDate] = useState("");
    const [currentTime, setCurrentTime] = useState(new Date());
    const [currentEvent, setCurrentEvent] = useState(null);
    const [nextEvent, setNextEvent] = useState(null);
    const [countdown, setCountdown] = useState("");

    // ✅ Fetch itinerary data
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/itinerary');
                const data = await response.json();
                if (data.success) {
                    setItinerary(data.data);
                }
            } catch (error) {
                console.error("Error fetching itinerary:", error);
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
        if (!itinerary) return;

        const today = currentTime.toLocaleString("en-US", { month: "long", day: "numeric" });

        const eventsToday = itinerary.schedule[today]?.timeline || [];
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
    }, [currentTime, itinerary]);  

    function parseTime(timeStr) {
        if (!timeStr) return 0;
        const parts = timeStr.match(/(\d+):?(\d+)?\s?(AM|PM)?/);
        if (!parts) return 0;

        let hour = parseInt(parts[1], 10);
        let minute = parts[2] ? parseInt(parts[2], 10) : 0;
        const isPM = parts[3] === "PM";

        return (hour % 12 + (isPM ? 12 : 0)) * 60 + minute;
    }

    return (
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
        </div>
    );
}
