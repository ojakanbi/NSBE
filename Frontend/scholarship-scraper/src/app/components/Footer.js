"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const emergencyContacts = [
    { name: "Dr. Grigs", role: "Faculty Advisor", phone: "814-865-6613." },
    { name: "Nate Ansu", role: "Conference Planning Chair", phone: "484-773-6383" },
    { name: "Ben", role: "NSBE Executive", phone: "708-603-3084" }
];

export default function EmergencyFooter() {
    const [currentContactIndex, setCurrentContactIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentContactIndex((prev) => (prev + 1) % emergencyContacts.length);
        }, 4000); // Rotate every 4 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed bottom-0 left-0 w-full bg-black/60 backdrop-blur-lg text-white text-sm py-2 px-4 shadow-lg flex items-center justify-between">
            <span className="text-yellow-300 font-semibold">🚨 Emergency Contact:</span>
            
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentContactIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center text-center w-full"
                >
                    <p className="font-semibold">{emergencyContacts[currentContactIndex].name}</p>
                    <p className="text-xs text-gray-300">{emergencyContacts[currentContactIndex].role}</p>
                    <p className="text-sm text-yellow-400 font-semibold">{emergencyContacts[currentContactIndex].phone}</p>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
