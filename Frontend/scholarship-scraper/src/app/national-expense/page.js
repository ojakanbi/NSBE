"use client";

import { useState, useEffect } from "react";
import { splitExpense, fetchUserExpenses, deleteExpense } from "../firebase/firebaseUserService";
import { auth, db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../components/Loading";
import BackToNational from "../components/BackToNational";

export default function ExpenseTracker() {
    const [amount, setAmount] = useState("");
    const [expenseCategory, setExpenseCategory] = useState("");
    const [description, setDescription] = useState("");
    const [users, setUsers] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [user, setUser] = useState(null);
    const router = useRouter();

    // 🔄 Check if user is authenticated
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (!currentUser) {
                setMessage("❌ User is not authenticated. Redirecting...");
                setTimeout(() => router.push("/login"), 2000);
            } else {
                setUser(currentUser);
            }
        });

        return () => unsubscribe();
    }, []);

    // 🔄 Fetch all students from Firestore
    useEffect(() => {
        if (!user) return;
        const fetchStudents = async () => {
            const studentsRef = collection(db, "students");
            const studentsSnapshot = await getDocs(studentsRef);
            const studentsList = studentsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setStudents(studentsList);
        };
        fetchStudents();
    }, [user]);

    // 🔄 Fetch expenses on component load
    useEffect(() => {
        if (!user) return;
        const fetchExpenses = async () => {
            setLoading(true);
            const userExpenses = await fetchUserExpenses();
            if (userExpenses) setExpenses(userExpenses);

            setLoading(false);
        };
        fetchExpenses();
    }, [user]);

    // ✨ Add student to split list (prevent duplicate users)
    const addUser = () => {
        if (!selectedUser) return;
        const userObj = students.find(student => student.firstname === selectedUser);
        if (!userObj) {
            setMessage("⚠️ Invalid user selected.");
            return;
        }

        // 🔍 Prevent duplicates
        if (users.some(user => user.email === userObj.email)) {
            setMessage("⚠️ User already added to this expense.");
            return;
        }

        setUsers([...users, userObj]);
        setSelectedUser("");
    };


    // ✅ Handle submitting expense
    const handleSplitExpense = async () => {
        if (!user) {
            setMessage("❌ User is not authenticated.");
            return;
        }

        if (!amount || !expenseCategory || users.length === 0) {
            setMessage("⚠️ Fill in all fields and add at least one user.");
            return;
        }

        setLoading(true);
        const success = await splitExpense(users, parseFloat(amount), expenseCategory, description);
        setLoading(false);

        if (success) {
            setMessage("✅ Expense added successfully!");
            setAmount("");
            setExpenseCategory("");
            setDescription("");
            setUsers([]);

            // Refresh expenses
            const updatedExpenses = await fetchUserExpenses();
            setExpenses(updatedExpenses);
        } else {
            setMessage("❌ Error adding expense.");
        }
    };

    // ❌ Handle deleting an expense
    const handleDeleteExpense = async (expenseId) => {
        const success = await deleteExpense(expenseId);
        if (success) {
            setExpenses(expenses.filter(exp => exp.id !== expenseId));
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center p-6 bg-gray-100">
            <BackToNational />
            <h1 className="text-3xl font-bold text-blue-700 mb-4">💰 Expense Splitter</h1>

            {/* 🔹 Expense Form */}
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                <label className="block text-gray-700 font-semibold">💵 Amount</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-2 border text-gray-700 rounded-md"
                    placeholder="Enter total amount"
                />

                <label className="block text-gray-700 font-semibold mt-3">📌 Category</label>
                <input
                    type="text"
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    className="w-full p-2 text-gray-700 border rounded-md"
                    placeholder="e.g. Food, Transport"
                />

                <label className="block text-gray-700 font-semibold mt-3">📝 Description</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 text-gray-700 border rounded-md"
                    placeholder="Enter description"
                />

                {/* 🔹 Select User Dropdown */}
                <div className="mt-3">
                    <label className="block text-gray-700 font-semibold">👥 Add User</label>
                    <input
                        type="text"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="w-full p-2 text-gray-900 border rounded-md"
                        placeholder="Type student's name..."
                    />
                    {/* 🔽 Dropdown Suggestions */}
                    {selectedUser && (
                        <div className="bg-white border rounded-md mt-2 max-h-40 overflow-y-auto">
                            {students
                                .filter(student =>
                                    student.firstname.toLowerCase().includes(selectedUser.toLowerCase())
                                )
                                .map((student, idx) => (
                                    <p
                                        key={idx}
                                        className="p-2 hover:bg-gray-200   text-gray-900  cursor-pointer"
                                        onClick={() => setSelectedUser(student.firstname)}
                                    >
                                        {student.firstname} {student.lastname}
                                    </p>
                                ))}
                        </div>
                    )}
                    <button onClick={addUser} className="mt-2 bg-blue-600 text-white px-3 py-2 rounded-md w-full">
                        ➕ Add
                    </button>
                </div>

                {/* 🔹 Show Added Users */}
                {users.length > 0 && (
                    <div className="mt-3">
                        <h2 className="text-gray-700 font-semibold">👥 Splitting With:</h2>
                        {users.map((u, idx) => (
                            <p key={idx} className="text-gray-500 text-sm">📧 {u.firstname} {u.lastname}</p>
                        ))}
                    </div>
                )}

                {/* 📌 Submit Button */}
                <button
                    onClick={handleSplitExpense}
                    className="mt-4 w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700"
                >
                    {loading ? <LoadingSpinner /> : "📤 Split Expense"}
                </button>

                {message && <p className="mt-3 text-sm text-center">{message}</p>}
            </div>

            {/* 🔹 Expense List */}
            <div className="w-full max-w-md mt-6">
                <h2 className="text-lg font-semibold text-gray-700">📜 Your Expenses</h2>

                {loading ? <LoadingSpinner /> : (
                    <div className="mt-3 bg-white p-4 rounded-lg shadow-md">
                        {expenses.length > 0 ? (
                            expenses.map((exp, index) => (
                                <div key={index} className="border-b py-2">
                                    <p className="font-semibold text-gray-800">{exp.category} - ${exp.amount}</p>
                                    <p className="text-gray-500 text-sm">{exp.description}</p>
                                    {/* 👥 Show Users Involved */}
                                    <div className="mt-1">
                                        <p className="text-gray-600 font-semibold">👥 Users Involved:</p>
                                        {exp.users.map((user, idx) => (
                                            <p key={idx} className="text-gray-500 text-sm">
                                                📧 {user.name} ({user.email})
                                            </p>
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-400">🧾 Split: ${exp.splitAmount.toFixed(2)} each</p>
                                    <button onClick={() => handleDeleteExpense(exp.id)} className="text-red-600 text-xs">❌ Settle</button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center">No expenses recorded yet.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
