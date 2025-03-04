"use client";

import { useEffect, useState, useRef } from "react";
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
import { Menu, X } from "lucide-react"; // Icons for menu
import ImageCarousel from "../components/ImageCarousel";

export default function National() {
    const [userData, setUserData] = useState(null);
    const [email, setEmail] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPhoneModal, setShowPhoneModal] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null); // Reference for menu
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userInfo = await fetchUserData();
                if (userInfo) {
                    setUserData(userInfo);
                    setIsLoggedIn(true);
                    localStorage.setItem("user", JSON.stringify(userInfo));

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

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        }
        if (showMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showMenu]);

    if (loading) return <LoadingSpinner />;

    return (
        <>
            <div className="min-h-screen w-full flex flex-col items-center p-6 bg-gray-50 relative">
                <BackToHome />

                {/* 🍔 Top Hamburger Menu */}
                <div className="w-full flex justify-end relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="bg-gray-700 text-white px-4 py-3 rounded-lg shadow-md flex items-center gap-2 hover:bg-gray-800 transition"
                    >
                        {showMenu ? <X size={24} /> : <Menu size={24} />}
                        Menu
                    </button>

                    {/* 📂 Dropdown Menu */}
                    <AnimatePresence>
                        {showMenu && (
                            <motion.div
                                ref={menuRef}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-16 right-4 bg-white shadow-lg rounded-lg overflow-hidden z-50"
                            >
                                {isLoggedIn ? (
                                    <>
                                        <button
                                            onClick={() => router.push("/national-profile")}
                                            className="block w-full text-left px-4 py-3 bg-blue-600 text-white hover:bg-blue-700 transition"
                                        >
                                            Edit Profile
                                        </button>
                                        <button
                                            onClick={() => router.push("/national-itinerary")}
                                            className="block w-full text-left px-4 py-3 bg-green-600 text-white hover:bg-green-700 transition"
                                        >
                                            View Itinerary
                                        </button>
                                        <button
                                            onClick={() => router.push("/national-transit")}
                                            className="block w-full text-left px-4 py-3 bg-yellow-600 text-white hover:bg-yellow-700 transition"
                                        >
                                            View Transit
                                        </button>
                                        <button
                                            onClick={() => router.push("/national-resources")}
                                            className="block w-full text-left px-4 py-3 bg-yellow-500 text-white hover:bg-yellow-600 transition"
                                        >
                                            Pre-Registration Links
                                        </button>
                                        <button
                                            onClick={() => router.push("/national-expense")}
                                            className="block w-full text-left px-4 py-3 bg-blue-900 text-white hover:bg-yellow-600 transition"
                                        >
                                            Split Expense
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-3 bg-red-600 text-white hover:bg-red-700 transition"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => router.push("/national-login")}
                                        className="block w-full text-left px-4 py-3 bg-blue-600 text-white hover:bg-blue-700 transition"
                                    >
                                        Sign In
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {isLoggedIn ? (
                    <div className="max-w-screen-md w-full bg-white p-6 md:p-8 rounded-2xl shadow-lg relative mt-6">
                        <h1 className="text-3xl font-extrabold text-blue-700 mb-1">
                            Oh hey, {userData?.firstname}!
                        </h1>
                        <p className="text-gray-500 text-sm">{userData?.major}</p>

                        <div className="w-full h-[2px] bg-gray-200 my-4"></div>

                        <ImageCarousel />

                    
                        {/* 🏢 Suggested Companies */}
                        <SuggestedCompanies userData={userData} />
                        {/* 📅 Recommended Workshops */}
                        <SuggestedWorkshops userData={userData} />
                         {/* 🏨 Roommates Section */}
                         <Roommates userData={userData} />
                    </div>
                ) : (
                    <form onSubmit={handleLogin} className="max-w-sm w-full bg-white p-6 rounded-2xl shadow-lg mt-6">
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
                                className="text-gray-900 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
                                required
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                        <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition">
                            Login
                        </button>
                    </form>
                )}

                <EmergencyFooter />
            </div>
        </>
    );
}

