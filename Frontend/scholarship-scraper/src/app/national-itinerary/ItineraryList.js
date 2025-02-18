'use client';

import { useEffect, useState } from 'react';

export default function ItineraryList({ itinerary, currentDate, currentEvent, nextEvent, countdown, currentTime }) {
    const [progress, setProgress] = useState(0);
    const eventsToday = itinerary.schedule[currentDate]?.timeline || [];

    // 🔄 Update progress bar for next event countdown
    useEffect(() => {
        if (!nextEvent || !countdown.startsWith("0h 0m")) return;
        
        let timeLeft = parseInt(countdown.split(" ")[2].replace("m", ""), 10);
        if (timeLeft <= 0) {
            setProgress(100);
        } else {
            setProgress(((60 - timeLeft) / 60) * 100);
        }

        const interval = setInterval(() => {
            setProgress((prev) => (prev >= 100 ? 0 : prev + (100 / 60)));
        }, 1000);

        return () => clearInterval(interval);
    }, [nextEvent, countdown]);

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-lg">
            {/* 🔥 Current Event Highlight */}
            {currentEvent ? (
                <div className="p-6 bg-blue-600 text-white rounded-lg shadow-md mb-6 transition-all">
                    <h2 className="text-2xl font-bold mb-2">🎉 Now Happening</h2>
                    <p className="text-lg font-semibold">{currentEvent.name}</p>
                    <p className="text-sm">{currentEvent.time || currentEvent.departure_time} - {currentEvent.end_time || currentEvent.expected_arrival}</p>
                    {currentEvent.description && (
                        <p className="text-sm mt-2 italic opacity-80">{currentEvent.description}</p>
                    )}
                </div>
            ) : (
                <p className="text-xl font-bold text-green-600 text-center mb-6">No event happening now</p>
            )}

            {/* ⏳ Next Event Countdown */}
            {nextEvent && (
                <div className="mb-6 p-4 bg-gray-200 rounded-lg shadow-sm text-center relative">
                    <h3 className="text-lg font-medium text-gray-800">Next: {nextEvent.name}</h3>
                    <p className="text-sm text-gray-600">{nextEvent.time || nextEvent.departure_time} - {nextEvent.end_time || nextEvent.expected_arrival}</p>
                    
                    {/* Visual Countdown Bar */}
                    <div className="w-full h-2 bg-gray-300 rounded-full mt-2">
                        <div 
                            className="h-full bg-blue-500 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {/* 🔮 Upcoming Events (Faded UI) */}
            <h3 className="text-lg font-semibold text-gray-700 text-center mb-3">📅 Upcoming Events</h3>
            {eventsToday.length > 0 ? (
                eventsToday.map((item, index) => (
                    <div 
                        key={index} 
                        className={`p-4 shadow-md rounded-lg mb-3 transition-all ${
                            currentEvent?.name === item.name ? "bg-blue-50 border-l-4 border-blue-500" : "bg-gray-100 opacity-70"
                        }`}
                    >
                        {item.type === "travel" && (
                            <div>
                                <p className="text-blue-600 font-medium">🚍 Travel - {item.departure_time} → {item.expected_arrival}</p>
                                <p className="text-gray-700"><strong>From:</strong> {item.start.name} ({item.start.address})</p>
                                <p className="text-gray-700"><strong>To:</strong> {item.destination.name} ({item.destination.address})</p>
                                <p className="text-gray-500"><strong>Duration:</strong> {item.drive_time}</p>
                                {item.notes && <p className="text-sm text-gray-600">📝 {item.notes}</p>}
                            </div>
                        )}

                        {item.type === "break" && (
                            <div>
                                <p className="text-yellow-600 font-medium">⏸️ Break - {item.duration}</p>
                                <p className="text-gray-700">{item.description}</p>
                            </div>
                        )}

                        {item.type === "event" && (
                            <div>
                                <p className={`text-lg font-semibold ${item.required ? "text-red-600" : "text-green-600"}`}>
                                    🎤 {item.name} ({item.time} - {item.end_time})
                                </p>
                                {item.required && <p className="text-sm text-red-500 font-semibold">⚠ Required Event</p>}
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500">No upcoming events for today.</p>
            )}
        </div>
    );
}
