export default function SuggestedComapnies({ userData }) {

    return (
        // <div className="bg-white p-4 rounded-lg shadow-md mb-4 border border-gray-200">
        //     <h2 className="text-xl font-extrabold text-blue-700 tracking-wide mb-3">
        //         🏢 Suggested Companies
        //     </h2>
        //     <h2 className="text-lg font-semibold text-gray-600 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-md inline-block shadow-sm animate-pulse">
        //         🚀 Coming Soon!!
        //     </h2>
        // </div>

            <div className="bg-white p-4 rounded-lg shadow-md mb-4 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">🏢 Suggested Companies</h2>
            <div className="flex space-x-3 overflow-x-auto p-2 scrollbar-hide">
                {userData?.suggested_companies?.length > 0 ? (
                    userData.suggested_companies.map((company, index) => (
                        <div key={index} className="text-blue-500 p-3 bg-gray-100 rounded-lg shadow-md text-center min-w-[120px] border border-gray-300">
                            {company}
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">No suggestions yet.</p>
                )}
            </div>
        </div>
    )
}