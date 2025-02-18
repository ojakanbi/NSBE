'use client';

import { useEffect, useState } from 'react';

export default function CurrentEvent({ itinerary }) {
    const [currentTime, setCurrentTime] = useState(new Date("March 4, 2025 23:30:00"));
    const [currentEvent, setCurrentEvent] = useState(null);
    const [nextEvent, setNextEvent] = useState(null);
    const [countdown, setCountdown] = useState("");

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setCurrentTime(new Date());
    //     }, 1000);

    //     return () => clearInterval(interval);
    // }, []);

    useEffect(() => {
        if (!itinerary) return;

        const today = new Date().toLocaleString("en-US", { month: "long", day: "numeric" });
        const eventsToday = itinerary.schedule[today]?.timeline || [];

        let now = currentTime.getHours() * 60 + currentTime.getMinutes(); // Convert to minutes
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
        }
    }, [currentTime, itinerary]);

    function parseTime(timeStr) {
        if (!timeStr) return 0;
        const [hour, minute] = timeStr.split(/:| /).map(Number);
        const isPM = timeStr.includes("PM");
        return (hour % 12 + (isPM ? 12 : 0)) * 60 + (minute || 0);
    }

    return (
        <div className="p-4 bg-gray-100 rounded-lg text-center">
            <p className="text-lg font-medium text-gray-700">🕒 Current Time: {currentTime.toLocaleTimeString()}</p>
            {currentEvent ? (
                <p className="text-xl font-bold text-blue-600">🎉 Now: {currentEvent.name}</p>
            ) : (
                <p className="text-xl font-bold text-green-600">⏳ Next: {nextEvent ? nextEvent.name : "No more events"} in {countdown}</p>
            )}
        </div>
    );
}
