export default function Roomates({userData}) {

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">🏨 Your Roommates</h2>
            <div className="flex space-x-3 overflow-x-auto p-2 scrollbar-hide">
                {userData?.roommates?.length > 0 ? (
                    userData.roommates.map((mate, index) => (
                        <div key={index} className="p-4 bg-gray-100 rounded-lg shadow-md text-center min-w-[140px] border border-gray-300">
                            <p className="text-blue-500 text-md font-semibold">{mate.firstname} {mate.lastname}</p>
                            <p className="text-sm text-gray-600">{mate.major}</p>
                            <p className="text-sm text-gray-500">{mate.phone}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">No roommates assigned yet.</p>
                )}
            </div>
        </div>
    )
}