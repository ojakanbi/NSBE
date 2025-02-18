'use client';

export default function ItineraryList({ itinerary, currentDate, currentEvent, nextEvent, countdown, currentTime }) {
    if (!itinerary) return <p className="text-center text-gray-600">Loading itinerary...</p>;

    return (
        <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-lg">
            {/* Live Event or Countdown */}
            <div className="p-4 bg-gray-100 rounded-lg text-center mb-4">
                <p className="text-lg font-medium text-gray-700">🕒 Current Time: {currentTime.toLocaleTimeString()}</p>
                {currentEvent ? (
                    <p className="text-xl font-bold text-blue-600">🎉 Now: {currentEvent.name}</p>
                ) : (
                    <p className="text-xl font-bold text-green-600">⏳ Next: {nextEvent ? nextEvent.name : "No more events"} in {countdown}</p>
                )}
            </div>

            {/* Live Schedule */}
            <h3 className="text-lg font-semibold text-blue-700 text-center mb-3">
                🔴 Live Itinerary for {currentDate}
            </h3>
            {itinerary.schedule[currentDate]?.timeline.length > 0 ? (
                itinerary.schedule[currentDate].timeline.map((item, index) => (
                    <div key={index} className="p-4 bg-gray-50 shadow-sm rounded-lg mb-3 border-l-4 border-blue-400">
                        {item.type === "travel" && (
                            <div>
                                <p className="text-blue-600 font-medium">
                                    🚍 Travel - {item.departure_time} → {item.expected_arrival}
                                </p>
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
                <p className="text-center text-gray-500">No events scheduled for today.</p>
            )}
        </div>
    );
}
