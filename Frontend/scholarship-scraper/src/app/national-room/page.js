'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BackToNational from '../components/BackToNational';

export default function NationalRoom() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [allUserData, setAllUserData] = useState([]);
    const [viewRoommates, setViewRoommates] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ Check for stored user on page load
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser || !storedUser.firstname) {
            router.push('/national-login'); // Redirect if no user is found
        } else {
            setUser(storedUser);
        }
    }, [router]); // ✅ Removed `user` to prevent infinite re-renders

    // ✅ Fetch all user data
    useEffect(() => {
        async function fetchAllUserData() {
            try {
                const response = await fetch('/api/user');
                if (!response.ok) {
                    throw new Error(`Error fetching users: ${response.statusText}`);
                }
                const data = await response.json();
                if (data.success) {
                    setAllUserData(data.data || []);
                } else {
                    console.error("API Error:", data.message);
                }
            } catch (error) {
                console.error("Fetch Error:", error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchAllUserData();
    }, []);

    // ✅ Fetch roommates based on user's room ID
    useEffect(() => {
        if (user && allUserData.length > 0) {
            const filteredRoommates = allUserData.filter(
                (roommate) => roommate.roomID === user.roomID && roommate.id !== user.id
            );
            setViewRoommates(filteredRoommates);
        }
    }, [user, allUserData]); // ✅ Ensures it only runs when user & allUserData are available

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <p className="text-gray-600 text-lg font-medium">Loading...</p>
            </div>
        );
    }

    if (!user) return null; // Prevent rendering if user data is not loaded

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
            <BackToNational />
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">🏨 Roommates</h2>

            <ul className="space-y-4 w-full max-w-md">
                {viewRoommates.length > 0 ? (
                    viewRoommates.map((roommate, index) => (
                        <li
                            key={index}
                            className="bg-white p-4 rounded-xl flex items-center gap-4 shadow-md hover:shadow-lg transition duration-300 border border-gray-200"
                        >
                            {/* Profile Avatar */}
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center rounded-full text-lg font-semibold shadow-md">
                                {roommate.firstname.charAt(0)}
                                {roommate.lastname.charAt(0)}
                            </div>

                            {/* Roommate Info */}
                            <div className="flex flex-col">
                                <span className="text-lg font-semibold text-gray-900">
                                    {roommate.firstname} {roommate.lastname}
                                </span>
                                <span className="text-sm text-gray-500">{roommate.major}</span>
                                <span className="text-sm text-blue-600 font-medium">{roommate.phonenumber}</span>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="text-center text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-md">
                        No roommates found
                    </li>
                )}
            </ul>

        </div>
    );
}
