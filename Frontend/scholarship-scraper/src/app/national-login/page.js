"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { fetchUserData } from "../firebase/firebaseUserService";
import BackToHome from "../components/BackToHomeButton";
import Roomates from "../components/Roomates";

export default function National() {
    const [userData, setUserData] = useState(null);
    const [email, setEmail] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userInfo = await fetchUserData();
                if (userInfo) {
                    setUserData(userInfo);
                    setIsLoggedIn(true);
                    localStorage.setItem("user", JSON.stringify(userInfo));
                }
            } else {
                setIsLoggedIn(false);
                setUserData(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogin = async (event) => {
        event.preventDefault();
        setError(null);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email + "@psu.edu", "defaultPassword123");
            const user = userCredential.user;
            const userInfo = await fetchUserData();
            if (userInfo) {
                setUserData(userInfo);
                setIsLoggedIn(true);
                localStorage.setItem("user", JSON.stringify(userInfo));
            } else {
                throw new Error("User data not found.");
            }
        } catch (error) {
            console.error("Login error:", error.message);
            setError("Invalid login. Please try again.");
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        localStorage.removeItem("user");
        setUserData(null);
        setIsLoggedIn(false);
        setEmail("");
        router.push("/national-login");
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center p-6 bg-gray-50">
            <BackToHome />

            {isLoggedIn ? (
                <div className="max-w-screen-md w-full bg-white p-6 md:p-8 rounded-2xl shadow-lg text-center relative">
                    {/* 🔧 Edit Profile Button */}
                    <button 
                        className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 font-semibold"
                        onClick={() => router.push("/national-profile")}
                    >
                        ✏️ Edit Profile
                    </button>

                    {/* 🎉 Personalized Welcome Heading */}
                    <h1 className="text-3xl font-extrabold mb-1 text-blue-700">
                        🎉 Hey {userData?.firstname}!
                    </h1>
                    <p className="text-gray-500 text-sm">{userData?.major}</p>

                    <div className="w-full h-[2px] bg-gray-200 my-4"></div>

                    {/* 🏨 Roommates Section */}
                
                    <Roomates userData={userData} />

                    {/* 🏢 Suggested Companies (Sliding Effect) */}
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

                    {/* 📅 Navigation Buttons */}
                    <div className="flex flex-col gap-4">
                     

                        <button
                            onClick={() => router.push("/national-itinerary")}
                            className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition duration-300 shadow-md"
                        >
                            📅 View Itinerary
                        </button>

                        <button
                            onClick={() => router.push("/national-transit")}
                            className="w-full bg-yellow-600 text-white font-semibold py-3 rounded-lg hover:bg-yellow-700 transition duration-300 shadow-md"
                        >
                            🚍 View Transit
                        </button>

                        {/* 🚪 Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition duration-300 shadow-md"
                        >
                            🚪 Logout
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
        </div>
    );
}
