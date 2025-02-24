'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BackToHome from '../components/BackToHomeButton';

export default function NationalResources() {
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortAsc, setSortAsc] = useState(true);

    // ✅ Check if user is logged in
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (!storedUser) {
                router.push('/national-login'); // Redirect if not logged in
            } else {
                setUserData(storedUser);
            }
        }
    }, [router]);

    // ✅ Fetch NSBE25 pre-registration links
    useEffect(() => {
        async function fetchResources() {
            try {
                const response = await fetch('/resources.json'); // ✅ Fetch from public folder
                if (!response.ok) {
                    throw new Error(`Error fetching resources: ${response.statusText}`);
                }
                const data = await response.json();
                setResources(data.NSBE25_Conference_Resources || []);
            } catch (error) {
                console.error("Fetch Error:", error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchResources();
    }, []);

    const handleSort = () => {
        const sortedData = [...resources].sort((a, b) => {
            return sortAsc
                ? a.Company.localeCompare(b.Company)
                : b.Company.localeCompare(a.Company);
        });
        setResources(sortedData);
        setSortAsc(!sortAsc);
    };

    const filteredData = resources.filter(resource =>
        resource.Company.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <p className="text-gray-600 text-lg font-medium">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
            <BackToHome />
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
                📌 NSBE25 Pre-Registration Links
            </h2>
            <p className="text-gray-600 text-lg mb-6">
                Hello, <span className="font-semibold text-gray-800">{userData?.firstname || 'User'}</span>! Explore and pre-register for NSBE25 opportunities.
            </p>
            
            <input 
                type="text" 
                placeholder="Search for a company..." 
                className="p-2 border rounded w-full max-w-md mb-4"
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
                onClick={handleSort} 
                className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
                Sort {sortAsc ? "A-Z" : "Z-A"}
            </button>
            
            <ul className="space-y-4 w-full max-w-2xl">
                {filteredData.length > 0 ? (
                    filteredData.map((resource, index) => (
                        <li 
                            key={`${resource.Company}-${index}`} 
                            className="bg-white p-4 rounded-xl flex flex-col gap-2 shadow-md hover:shadow-lg transition duration-300 border border-gray-200"
                        >
                            <span className="text-lg font-semibold text-gray-900">
                                {resource.Company}
                            </span>
                            <a 
                                href={resource.Link} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-sm text-blue-600 font-medium hover:underline"
                            >
                                {resource.Description}
                            </a>
                            <button 
                                onClick={() => window.open(resource.Link, '_blank')} 
                                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                            >
                                Register
                            </button>
                        </li>
                    ))
                ) : (
                    <li className="text-center text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-md">
                        No matching results found
                    </li>
                )}
            </ul>
        </div>
    );
}
