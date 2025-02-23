import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth } from "./firebaseConfig"; // Ensure correct Firebase setup

const db = getFirestore();

export const fetchUserData = async () => {
    const user = auth.currentUser;
    if (!user) {
        console.error("❌ No authenticated user found.");
        return null;
    }

    try {
        const userDocRef = doc(db, "students", user.uid); // Use UID, not email
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            console.log("✅ User data found:", userDoc.data());
            return userDoc.data();
        } else {
            console.warn("⚠️ User data not found in Firestore!");
            return null;
        }
    } catch (error) {
        console.error("❌ Error fetching user data:", error);
        return null;
    }
};
