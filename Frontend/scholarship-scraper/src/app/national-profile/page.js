"use client";

import React, { useState } from 'react';
import { updateUserPhone } from '../firebase/firebaseUserService';
import BackToNational from "../components/BackToNational";

export default function Profile() {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  // Helper function to remove non-digits and format the phone number to xxx-xxx-xxxx.
  const formatPhoneNumber = (value) => {
    // Remove all non-digit characters.
    const cleaned = value.replace(/\D/g, '');
    // Check if the input contains exactly 10 digits.
    if (cleaned.length !== 10) {
      return null;
    }
    // Format as xxx-xxx-xxxx.
    const areaCode = cleaned.slice(0, 3);
    const firstPart = cleaned.slice(3, 6);
    const secondPart = cleaned.slice(6, 10);
    return `${areaCode}-${firstPart}-${secondPart}`;
  };

  const handleUpdatePhone = async () => {
    // Format the input phone number.
    const formattedPhone = formatPhoneNumber(phone);
    if (!formattedPhone) {
      setMessage('Please enter a valid 10-digit phone number (e.g., 1234567890).');
      return;
    }
    try {
      await updateUserPhone(formattedPhone);
      setPhone(formattedPhone); // Update the state to reflect the formatted number.
      setMessage('Phone updated successfully!');
    } catch (error) {
      console.error("Error updating phone:", error);
      setMessage('Error updating phone.');
    }
  };

  return (
 
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
    <BackToNational />

    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>
        Update Your Phone Number
      </h1>
      <div style={{ marginBottom: '15px', width: '100%', maxWidth: '400px' }}>
        <input
          type="text"
          id="phoneInput"
          placeholder="Enter 10-digit phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '1rem'
          }}
        />
      </div>
      <button 
        id="updatePhoneButton"
        onClick={handleUpdatePhone}
        style={{
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          backgroundColor: '#0070f3',
          color: '#fff',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
      >
        Update Phone
      </button>
      {message && (
        <p style={{ marginTop: '15px', fontSize: '1rem', color: '#333' }}>
          {message}
        </p>
      )}
      
    </main>
    </div>

  );
}
