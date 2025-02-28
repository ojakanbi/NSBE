"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { fetchUserData, updateUserPhone } from "../firebase/firebaseUserService";
import BackToHome from "../components/BackToHomeButton";
import Roommates from "../components/Roommates";
import SuggestedCompanies from "../components/SuggestedCompanies";
import SuggestedWorkshops from "../components/SuggestedWorkshops";
import LoadingSpinner from "../components/Loading";
import EmergencyFooter from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";

export default function National() {
    const [userData, setUserData] = useState(null);
    const [email, setEmail] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPhoneModal, setShowPhoneModal] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userInfo = await fetchUserData();
                if (userInfo) {
                    setUserData(userInfo);
                    setIsLoggedIn(true);
                    localStorage.setItem("user", JSON.stringify(userInfo));

                    // Prompt user if phone number is missing
                    if (!userInfo.phone || userInfo.phone === "not provided") {
                        setShowPhoneModal(true);
                    }
                }
            } else {
                setIsLoggedIn(false);
                setUserData(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleLogin = async (event) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, `${email}@psu.edu`, "defaultPassword123");
            const user = userCredential.user;
            const userInfo = await fetchUserData();

            if (userInfo) {
                setUserData(userInfo);
                setIsLoggedIn(true);
                localStorage.setItem("user", JSON.stringify(userInfo));

                if (!userInfo.phone || userInfo.phone === "not provided") {
                    setShowPhoneModal(true);
                }
            } else {
                throw new Error("User data not found.");
            }
        } catch (error) {
            console.error("Login error:", error.message);
            setError("Invalid login. Please try again.");
        }

        setLoading(false);
    };

    const handleLogout = async () => {
        await signOut(auth);
        localStorage.removeItem("user");
        setUserData(null);
        setIsLoggedIn(false);
        setEmail("");
        router.push("/national-login");
    };

    const handleUpdateNumber = async () => {
        if (!phoneNumber.trim()) return;

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phoneNumber)) {
            setError("Please enter a valid 10-digit phone number (e.g., 1234567890).");
            return;
        }

        try {
            setError(null);
            await updateUserPhone(phoneNumber);
            setUserData((prev) => ({ ...prev, phone: phoneNumber }));
            setShowPhoneModal(false);
        } catch (error) {
            console.error("Error updating phone number:", error);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <>
            <div className="min-h-screen w-full flex flex-col items-center p-6 bg-gray-50">
                {/* 🔙 Back Button */}
                <BackToHome />

                {/* ✅ MAIN CONTAINER */}
                {isLoggedIn ? (
                    <div className="max-w-screen-md w-full bg-white p-6 md:p-8 rounded-2xl shadow-lg relative">
                        {/* ✏️ Profile Button */}
                        <button
                            className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 text-sm font-semibold rounded-md shadow-lg hover:bg-blue-700 transition duration-300"
                            onClick={() => router.push("/national-profile")}
                        >
                            Edit Profile
                        </button>

                        {/* 🎉 Welcome Heading */}
                        <h1 className="text-3xl font-extrabold text-blue-700 mb-1">
                            Hey {userData?.firstname}!
                        </h1>
                        <p className="text-gray-500 text-sm">{userData?.major}</p>

                        <div className="w-full h-[2px] bg-gray-200 my-4"></div>

                        {/* 🏨 Roommates Section */}
                        <Roommates userData={userData} />

                        {/* 🏢 Suggested Companies */}
                        <SuggestedCompanies userData={userData} />

                        {/* 📅 Recommended Workshops */}
                        <SuggestedWorkshops userData={userData} />

                        {/* 🔗 Feature Buttons */}
                        <div className="flex flex-col gap-4 mt-6">
                            <button
                                onClick={() => router.push("/national-itinerary")}
                                className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition duration-300 shadow-md"
                            >
                                View Itinerary
                            </button>

                            <button
                                onClick={() => router.push("/national-transit")}
                                className="w-full bg-yellow-600 text-white font-semibold py-3 rounded-lg hover:bg-yellow-700 transition duration-300 shadow-md"
                            >
                                View Transit
                            </button>

                            <button
                                onClick={() => router.push('/national-resources')}
                                className="w-full bg-yellow-500 text-white font-semibold py-3 rounded-lg hover:bg-yellow-600 transition duration-300 shadow-md"
                            >
                                Pre-Registration Links
                            </button>

                            {/* 🚪 Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="w-full bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition duration-300 shadow-md"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleLogin} className="max-w-sm w-full bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">Login</h2>

                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
                                Enter your PSU Email ID
                            </label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                placeholder="abc123"
                                value={email.toLowerCase()}
                                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                                className="text-gray-900 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                required
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                        <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                            Login
                        </button>
                    </form>
                )}

                <EmergencyFooter />

                {/* 📌 Phone Modal */}
                <AnimatePresence>
                    {showPhoneModal && (
                        <motion.div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                                <h2 className="text-lg font-bold text-gray-700 mb-4">📞 Enter Your Phone Number</h2>
                                <input
                                    type="tel"
                                    className="border rounded-md p-2 w-full"
                                    placeholder="Your phone number"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                                <button onClick={handleUpdateNumber} className="bg-blue-600 text-white py-2 px-4 mt-4 rounded-md">
                                    Save
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
