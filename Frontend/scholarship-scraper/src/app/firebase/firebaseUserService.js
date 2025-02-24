import { auth } from "./firebaseConfig";
import { getFirestore, collection, doc, getDoc, query, where, getDocs } from "firebase/firestore";

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
