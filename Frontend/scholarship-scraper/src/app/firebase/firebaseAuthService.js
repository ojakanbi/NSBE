import { auth } from "./firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

// ✅ Login User
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("❌ Login failed:", error);
    return null;
  }
}
