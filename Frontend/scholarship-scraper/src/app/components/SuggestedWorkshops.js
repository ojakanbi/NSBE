export default function RecommendedWorkshops({ userData }) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">📅 Recommended Workshops</h2>
            <div className="flex space-x-3 overflow-x-auto p-2 scrollbar-hide">
                {userData?.recommended_workshops?.length > 0 ? (
                    userData.recommended_workshops.map((workshop, index) => (
                        <div key={index} className="p-4 bg-gray-100 rounded-lg shadow-md min-w-[200px] border border-gray-300 text-center">
                            <p className="text-blue-600 font-semibold">{workshop.title}</p>
                            <p className="text-sm text-gray-500">{workshop.date} • {workshop.time}</p>
                            <p className="text-xs text-gray-600">{workshop.location}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">No workshops assigned yet.</p>
                )}
            </div>
        </div>
    );
}
