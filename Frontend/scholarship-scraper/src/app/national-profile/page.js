"use client";

import React, { useState } from 'react';
import { updateUserPhone } from '../firebase/firebaseUserService';
import BackToNational from "../components/BackToNational";

export default function Profile() {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  // Helper function to remove non-digits and format the phone number to xxx-xxx-xxxx.
  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      return null;
    }
    const areaCode = cleaned.slice(0, 3);
    const firstPart = cleaned.slice(3, 6);
    const secondPart = cleaned.slice(6, 10);
    return `${areaCode}-${firstPart}-${secondPart}`;
  };

  const handleUpdatePhone = async () => {
    const formattedPhone = formatPhoneNumber(phone);
    if (!formattedPhone) {
      setMessage('Please enter a valid 10-digit phone number (e.g., 1234567890).');
      return;
    }
    try {
      await updateUserPhone(formattedPhone);
      setPhone(formattedPhone);
      setMessage('Phone updated successfully!');
    } catch (error) {
      console.error("Error updating phone:", error);
      setMessage('Error updating phone.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      {/* Header container: BackToNational button centered */}
      <div className="max-w-md mx-auto mb-4 flex justify-center">
        <BackToNational />
      </div>
      {/* Card container with limited width */}
      <div className="max-w-md mx-auto">
        <div className="bg-white text-black shadow-lg rounded-lg p-8">
          <h1 className="text-2xl font-bold mb-5">Update Your Phone Number</h1>
          <div className="mb-4">
            <input
              type="text"
              id="phoneInput"
              placeholder="Enter 10-digit phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border rounded-md border-gray-300 text-black focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <button 
            id="updatePhoneButton"
            onClick={handleUpdatePhone}
            className="w-full px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Update Phone
          </button>
          {message && (
            <p className="mt-4 text-base">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

