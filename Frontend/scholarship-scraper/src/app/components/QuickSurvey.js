"use client";

import { use, useState, useEffect} from "react";
import { db, auth } from "../firebase/firebaseConfig"; // Firestore & Auth imports
import { collection, addDoc } from "firebase/firestore";


const QuickSurvey = () => {
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);


    const handleInputChange = (e) => {
        setAnswer(e.target.value);
    };



    const handleSubmit = async () => {
        if (!answer.trim()) {
            setMessage("⚠️ Please enter an answer.");
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const user = auth.currentUser;
            if (!user) throw new Error("User not authenticated!");

            await addDoc(collection(db, "survey_responses"), {
                userId: user.uid,
                email: user.email,
                answer: answer,
                timestamp: new Date(),
            });

            setMessage("✅ Response submitted successfully!");
            setAnswer(""); // Clear input field
        } catch (error) {
            console.error("❌ Error submitting survey:", error);
            setMessage("❌ Failed to submit response. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white mt-5 p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold text-gray-800 mb-2">What are some features you want to see on here to help your Nationals experience ?</h2>
            <label htmlFor="answer" className="text-sm text-gray-600">
                Type your answer:
            </label>
            <input
                type="text"
                id="answer"
                value={answer}
                onChange={handleInputChange}
                className="w-full text-gray-800 mt-2 p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
            />
            <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full mt-4 px-4 py-2 rounded-lg text-white font-semibold shadow-md transition ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
                {loading ? "Submitting..." : "Submit"}
            </button>

            {message && <p className="text-sm mt-2 text-gray-800 text-center">{message} Our team will try and get that to you</p>}
        </div>
    );
};

export default QuickSurvey;
