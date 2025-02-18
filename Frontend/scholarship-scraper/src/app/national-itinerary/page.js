'use client';

import { useState, useEffect } from 'react';
import ItineraryList from './ItineraryList';
import FullItinerary from './FullItinerary';
import BackToNational from '../components/BackToNational';

export default function Itinerary() {
    const [itinerary, setItinerary] = useState(null);
    const [selectedView, setSelectedView] = useState("live");
    const [currentDate, setCurrentDate] = useState("");
    const [currentTime, setCurrentTime] = useState(new Date());  // Ensure currentTime is always valid
    const [currentEvent, setCurrentEvent] = useState(null);
    const [nextEvent, setNextEvent] = useState(null);
    const [countdown, setCountdown] = useState("");

    // 🔧 Debug Mode State
    const [debugMode, setDebugMode] = useState(false);
    const [debugDate, setDebugDate] = useState("2025-03-05");
    const [debugTime, setDebugTime] = useState("00:00");
    const [mockTime, setMockTime] = useState(new Date(`${debugDate}T${debugTime}:00`)); // Initialize with default value

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

    useEffect(() => {
        if (debugMode) {
            // Ensure mockTime is always a valid Date object
            if (!mockTime || isNaN(mockTime.getTime())) {
                setMockTime(new Date(`${debugDate}T${debugTime}:00`));
            }

            // Simulate time moving forward in Debug Mode
            const interval = setInterval(() => {
                setMockTime((prevTime) => {
                    if (!prevTime) return new Date(`${debugDate}T${debugTime}:00`);  // Ensure it initializes
                    return new Date(prevTime.getTime() + 60000); // Increment 1 min per second
                });
            }, 1000);

            return () => clearInterval(interval);
        } else {
            setCurrentDate(new Date().toLocaleString("en-US", { month: "long", day: "numeric" }));

            const interval = setInterval(() => {
                setCurrentTime(new Date());
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [debugMode, debugDate, debugTime]);

    useEffect(() => {
        if (!itinerary) return;

        const nowTime = debugMode ? mockTime : currentTime;
        if (!nowTime || isNaN(nowTime.getTime())) return;

        const today = nowTime.toLocaleString("en-US", { month: "long", day: "numeric" });

        const eventsToday = itinerary.schedule[today]?.timeline || [];
        let now = nowTime.getHours() * 60 + nowTime.getMinutes();

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
    }, [currentTime, mockTime, itinerary]);

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

            {/* 🔧 Debug Mode Toggle */}
            <button
                onClick={() => setDebugMode(!debugMode)}
                className={`mb-4 px-4 py-2 font-semibold rounded-lg shadow-md ${
                    debugMode ? "bg-red-500 text-white" : "bg-blue-500 text-white"
                }`}
            >
                {debugMode ? "🔴 Disable Debug Mode" : "🛠 Enable Debug Mode"}
            </button>

            {/* Debug Mode UI */}
            {debugMode && (
                <div className="w-full max-w-md bg-white p-4 rounded-lg shadow-md mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">🛠 Debug Settings</h3>
                    <div className="flex flex-col gap-2 mt-2">
                        <label className="text-sm text-gray-600">📅 Date:</label>
                        <input
                            type="date"
                            value={debugDate}
                            onChange={(e) => setDebugDate(e.target.value)}
                            className="border rounded p-2"
                        />
                        <label className="text-sm text-gray-600">⏰ Time:</label>
                        <input
                            type="time"
                            value={debugTime}
                            onChange={(e) => setDebugTime(e.target.value)}
                            className="border rounded p-2"
                        />
                    </div>
                </div>
            )}

            {/* Current Event Display */}
            <div className="p-4 bg-white rounded-lg shadow-md text-center mb-4 w-full max-w-lg">
                <p className="text-lg font-medium text-gray-700">
                    🕒 {debugMode ? "Debugging Time" : "Current Time"}: {(debugMode ? mockTime : currentTime)?.toLocaleTimeString() || "Loading..."}
                </p>
                {currentEvent ? (
                    <p className="text-xl font-bold text-blue-600">
                        🎉 Now: {currentEvent.name || currentEvent.type} ({currentEvent.time || currentEvent.departure_time} - {currentEvent.end_time || currentEvent.expected_arrival})
                    </p>
                ) : (
                    <p className="text-xl font-bold text-green-600">
                        ⏳ Next: {nextEvent ? `${nextEvent.name || nextEvent.type} in ${countdown}` : "No more events today"}
                    </p>
                )}
            </div>

            {/* Render Itinerary */}
            {selectedView === "live" ? (
                <ItineraryList itinerary={itinerary} currentDate={currentDate} currentEvent={currentEvent} nextEvent={nextEvent} countdown={countdown} currentTime={debugMode ? mockTime : currentTime} />
            ) : (
                <FullItinerary itinerary={itinerary} currentDate={currentDate} />
            )}
        </div>
    );
}
