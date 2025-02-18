'use client';

export default function CurrentEvent({ currentEvent, nextEvent, countdown, currentTime }) {
    return (
        <div className="p-4 bg-white rounded-lg shadow-md text-center mb-4 w-full max-w-lg">
            <p className="text-lg font-medium text-gray-700">
                🕒 Current Time: {currentTime.toLocaleTimeString()}
            </p>
            {currentEvent ? (
                <p className="text-xl font-bold text-blue-600">
                    🎉 Now: {currentEvent.name || currentEvent.type} 
                    ({currentEvent.time || currentEvent.departure_time} - {currentEvent.end_time || currentEvent.expected_arrival})
                </p>
            ) : (
                <p className="text-xl font-bold text-green-600">
                    ⏳ Next: {nextEvent ? `${nextEvent.name || nextEvent.type} in ${countdown}` : "No more events today"}
                </p>
            )}
        </div>
    );
}
