"use client";

import React, { useState, useEffect } from 'react';
import { updateUserPhone } from '../firebase/firebaseUserService';
import BackToNational from "../components/BackToNational";
import EmergencyFooter from "../components/Footer";
import QuickSurvey from '../components/QuickSurvey';

export default function Profile() {
    const [userData, setUserData] = useState(null);
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUserData(storedUser);
            setPhone(storedUser.phone || "Not Provided");
        }
    }, []);

    // Format phone number to (xxx-xxx-xxxx)
    const formatPhoneNumber = (value) => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length !== 10) return null;
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    };

    // Handle phone number update
    const handleUpdatePhone = async () => {
        const formattedPhone = formatPhoneNumber(phone);
        if (!formattedPhone) {
            setMessage('⚠️ Enter a valid 10-digit phone number.');
            return;
        }
        try {
            await updateUserPhone(userData.email, formattedPhone);
            setPhone(formattedPhone);
            setMessage('✅ Phone updated successfully!');
        } catch (error) {
            console.error("Error updating phone:", error);
            setMessage('❌ Error updating phone.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center p-6 bg-gray-100">
            <BackToNational />

            <div className="max-w-md w-full bg-white shadow-xl rounded-xl p-6 text-center relative">
                {/* Avatar with initials */}
                <div className="w-20 h-20 mx-auto bg-blue-600 text-gray flex items-center justify-center text-3xl font-bold rounded-full shadow-md">
                    {userData ? `${userData.firstname[0]}${userData.lastname[0]}` : "?"}
                </div>

                {/* Name */}
                <h1 className="text-2xl text-black font-bold mt-3">{userData?.firstname} {userData?.lastname}</h1>
                <p className="text-gray-500 text-sm">{userData?.email}</p>

                {/* Read-only fields */}
                <div className="mt-4 text-left text-sm space-y-3">
                    <p className="bg-gray-100 text-black p-2 rounded-md"><span className="font-semibold">Major:</span> {userData?.major || "N/A"}</p>
                    <p className="bg-gray-100 text-black p-2 rounded-md"><span className="font-semibold">Room ID:</span> {userData?.roomID || "N/A"}</p>
                </div>

                {/* Phone number update section */}
                <div className="mt-5">
                    <h2 className="text-lg font-semibold text-gray-700">📞 Update Phone Number</h2>
                    <input
                        type="text"
                        placeholder="Enter 10-digit phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full text-black mt-2 px-3 py-2 border rounded-md border-gray-300 focus:ring-blue-300 focus:outline-none"
                    />
                    <button
                        onClick={handleUpdatePhone}
                        className="mt-3 w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition duration-300"
                    >
                        Update Phone
                    </button>
                    {message && <p className="mt-3 text-sm">{message}</p>}
                </div>
            </div>

        
            <EmergencyFooter />
        </div>
    );
}
