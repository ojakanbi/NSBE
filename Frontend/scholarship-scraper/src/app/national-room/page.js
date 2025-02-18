'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BackToNational from '../components/BackToNational';

export default function NationalRoom() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [allUserData, setAllUserData] = useState([]);
    const [viewRoommates, setViewRoommates] = useState([]);

    // Check for stored user on page load
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser || !storedUser.firstname) {
            router.push('/national-login'); // Redirect to login if no user found
        } else {
            setUser(storedUser);
        }
    }, []);

    //  Fetch all user data
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
    }, [allUserData, user]); // Runs when user or allUserData updates

    if (!user) return null; // Prevent rendering if user data is not loaded

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
            <BackToNational />
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">🏨 Roommates</h2>

            <ul className="space-y-3">
                {viewRoommates.length > 0 ? (
                    viewRoommates.map((roommate, index) => (
                        <li 
                            key={index} 
                            className="bg-gray-200 p-3 rounded-lg flex items-center gap-3 shadow-sm hover:bg-gray-200 transition duration-300"
                        >
                            <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full font-semibold">
                                {roommate.firstname.charAt(0)}{roommate.lastname.charAt(0)}
                            </div>
                            <span className="text-gray-700 text-lg font-medium">
                                {roommate.firstname} {roommate.lastname}
                            </span>
                        </li>
                    ))
                ) : (
                    <li className="text-center text-gray-500 bg-gray-50 p-3 rounded-lg">
                        No roommates found
                    </li>
                )}
            </ul>
        </div>
    );
}
