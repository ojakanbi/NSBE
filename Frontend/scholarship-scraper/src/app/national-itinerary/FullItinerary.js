'use client';
import { useState } from 'react';

export default function FullItinerary({ itinerary, currentDate }) {
    const itineraryDays = Object.keys(itinerary.schedule);
    const [selectedDayIndex, setSelectedDayIndex] = useState(itineraryDays.indexOf(currentDate) || 0);
    if (!itinerary) return <p className="text-center text-gray-600">Loading itinerary...</p>;




    const handleNextDay = () => {
        if (selectedDayIndex < itineraryDays.length - 1) {
            setSelectedDayIndex(selectedDayIndex + 1);
        }
    };

    const handlePrevDay = () => {
        if (selectedDayIndex > 0) {
            setSelectedDayIndex(selectedDayIndex - 1);
        }
    };

    const selectedDay = itineraryDays[selectedDayIndex];

    return (
        <div className="p-6 bg-green-50 rounded-lg border border-green-300">
            <div className="flex justify-between items-center mb-4">
                {/* Left Arrow (Disable if on the first day) */}
                <button
                    onClick={handlePrevDay}
                    disabled={selectedDayIndex === 0}
                    className={`text-gray-600 hover:text-gray-800 text-xl p-2 ${selectedDayIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    ◀
                </button>

                {/* Current Selected Day */}
                <h3 className="text-xl font-semibold text-green-700 text-center">{selectedDay} {selectedDay === currentDate && "(Today)"}</h3>

                {/* Right Arrow (Disable if on the last day) */}
                <button
                    onClick={handleNextDay}
                    disabled={selectedDayIndex === itineraryDays.length - 1}
                    className={`text-gray-600 hover:text-gray-800 text-xl p-2 ${selectedDayIndex === itineraryDays.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    ▶
                </button>
            </div>

            {/* Display Events for the Selected Day */}
            {itinerary.schedule[selectedDay]?.timeline.length > 0 ? (
                itinerary.schedule[selectedDay].timeline.map((item, index) => (
                    <div key={index} className="p-4 bg-white shadow-md rounded-lg mb-3 border-l-4 border-blue-400">
                        {/* Travel Section */}
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


                        {item.type === "check-in" && (
                            <div>
                                <p className="text-blue-600 font-medium">🏨 Check-In - {item.time}</p>
                                <p className="text-gray-700">{item.location}</p>

                            </div>

                        )}

                        {/* Break Section */}
                        {item.type === "break" && (
                            <div>
                                <p className="text-yellow-600 font-medium">⏸️ Break - {item.duration}</p>
                                <p className="text-gray-700">{item.description}</p>
                            </div>
                        )}

                        {item.type === "check-out" && (
                            <div>
                                <p className="text-yellow-600 font-medium">👋 Check Out - {item.time}</p>
                                <p className="text-gray-700">{item.description}</p>
                            </div>
                        )}


                        {item.type === "volunteering" && (
                            <div>
                                <p className="text-yellow-600 font-medium">🧑‍🧑‍🧒 Volunteering - {item.time}</p>
                                <p className="text-gray-700">{item.description}</p>
                            </div>
                        )}


                        {/* Event Section */}
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
                <p className="text-center text-gray-500">No events scheduled for {currentDate}.</p>
            )}
        </div>
    );
}



