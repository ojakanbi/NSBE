import { auth } from "./firebaseConfig";
import { getFirestore, collection, doc, getDoc, query, where, getDocs, updateDoc, addDoc, deleteDoc} from "firebase/firestore";

const db = getFirestore();

export const fetchUserData = async () => {
    let user = auth.currentUser;
    let userDocData = null;

    try {
        if (user) {
            // ✅ 1. Try fetching user data by UID (fastest method)
            const userDocRef = doc(db, "students", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                console.log("✅ User found via UID lookup:", userDoc.data());
                userDocData = userDoc.data();
            }
        }

        // ✅ 2. If user not found via UID, fallback to querying by email
        if (!userDocData && user?.email) {
            console.warn("⚠️ User not found via UID, trying email lookup...");
            const usersRef = collection(db, "students");
            const userQuery = query(usersRef, where("email", "==", user.email));
            const userSnapshot = await getDocs(userQuery);

            if (!userSnapshot.empty) {
                userDocData = userSnapshot.docs[0].data();
                console.log("✅ User found via email lookup:", userDocData);
            } else {
                console.warn("⚠️ User not found in Firestore!");
                return null;
            }
        }

        if (!userDocData) {
            console.error("❌ No user found in Firestore.");
            return null;
        }

        // ✅ 3. Fetch roommates dynamically based on `roomID`
        const roommates = await fetchRoommates(userDocData.roomID, userDocData.email);
        userDocData.roommates = roommates;

        return userDocData;
    } catch (error) {
        console.error("❌ Error fetching user data:", error);
        return null;
    }
};

// ✅ Function to fetch roommates dynamically
const fetchRoommates = async (roomID, currentUserEmail) => {
    if (!roomID) return [];

    try {
        const usersRef = collection(db, "students");
        const roommatesQuery = query(usersRef, where("roomID", "==", roomID));
        const roommatesSnapshot = await getDocs(roommatesQuery);

        if (roommatesSnapshot.empty) {
            console.warn("⚠️ No roommates found for room:", roomID);
            return [];
        }

        // ✅ Filter out the current user & map roommate data
        const roommates = roommatesSnapshot.docs
            .map(doc => doc.data())
            .filter(roommate => roommate.email !== currentUserEmail)
            .map(roommate => ({
                firstname: roommate.firstname,
                lastname: roommate.lastname,
                major: roommate.major,
                phone: roommate.phone || "Not Provided",
            }));

        console.log(`🏨 Found ${roommates.length} roommates for room ${roomID}:`, roommates);
        return roommates;
    } catch (error) {
        console.error("❌ Error fetching roommates:", error);
        return [];
    }
};

//User edit phone number
export const updateUserPhone = async (newPhone) => {
    const user = auth.currentUser;
    if (!user) {
      console.error("User is not authenticated.");
      return;
    }
  
    const userDocRef = doc(db, "students", user.uid);
  
    try {
      await updateDoc(userDocRef, { phone: newPhone });
      console.log("User phone updated successfully.");
    } catch (error) {
      console.error("Error updating user phone:", error);
    }
  };


  export const splitExpense = async (users, amount, expenseCategory, description) => { 
    const user = auth.currentUser;
    if (!user) {
        console.error("User is not authenticated");
        return false;
    }

    const totalUsers = users.length + 1; // Include the payer
    const splitAmount = amount / totalUsers;

    // ✅ Store names & emails in `users` AND store only emails in `userEmails`
    const participants = [
        { email: user.email, name: "(Payer)" }, // Include the payer
        ...users.map(u => ({
            email: u.email,
            name: `${u.firstname} ${u.lastname}`
        }))
    ];

    const userEmails = participants.map(u => u.email); // Extract emails

    const expense = {
        amount: amount,
        category: expenseCategory,
        description: description,
        paidBy: user.email,
        splitAmount: splitAmount,
        users: participants, // ✅ Store names & emails
        userEmails: userEmails, // ✅ Store only emails for Firestore querying
        createdAt: new Date(),
    };

    try {
        const expenseRef = collection(db, "expenses");
        await addDoc(expenseRef, expense);
        console.log("✅ Expense added successfully.");
        return true;
    } catch (error) {
        console.error("❌ Error adding expense:", error);
        return false;
    }
};


export const fetchUserExpenses = async () => {
    const user = auth.currentUser;
    if (!user) {
        console.error("User is not authenticated");
        return [];
    }

    try {
        const expensesRef = collection(db, "expenses");

        // 🔹 Query for expenses where the user is involved
        const participantQuery = query(
            expensesRef, 
            where("userEmails", "array-contains", user.email) // ✅ Now works because `userEmails` is an array of strings
        );

        // 🔹 Query for expenses where the user is the payer
        const payerQuery = query(
            expensesRef, 
            where("paidBy", "==", user.email)
        );

        // Fetch both sets of expenses
        const [participantSnapshot, payerSnapshot] = await Promise.all([
            getDocs(participantQuery),
            getDocs(payerQuery)
        ]);

        // Merge, remove duplicates, and clean up data
        const uniqueExpenses = new Map();
        
        [...participantSnapshot.docs, ...payerSnapshot.docs].forEach(doc => {
            if (!uniqueExpenses.has(doc.id)) {
                uniqueExpenses.set(doc.id, {
                    id: doc.id,
                    ...doc.data()
                });
            }
        });

        return Array.from(uniqueExpenses.values());
    } catch (error) {
        console.error("❌ Error fetching expenses:", error);
        return [];
    }
};



// ✅ Delete an Expense (Once Settled)
export const deleteExpense = async (expenseId) => {
    try {
        await deleteDoc(doc(db, "expenses", expenseId));
        console.log("✅ Expense deleted successfully.");
        return true;
    } catch (error) {
        console.error("❌ Error deleting expense:", error);
        return false;
    }
};


// ✅ Fetch All Students for User Selection
export const fetchStudents = async () => {
    try {
        const studentsRef = collection(db, "students");
        const studentsSnapshot = await getDocs(studentsRef);
        
        return studentsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("❌ Error fetching students:", error);
        return [];
    }
};