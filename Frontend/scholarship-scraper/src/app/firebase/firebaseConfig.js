// src/app/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

import dotenv from "dotenv";
dotenv.config();

console.log(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
// Firebase Configuration (Replace with your credentials)
const firebaseConfig = {
  apiKey:"AIzaSyCY3Pj72GFlXVRgemhv6DMU0Q0THsXvSPs",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};


// console.log("🔥 Initializing Firebase... ", firebaseConfig);


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore, Auth & Storage
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
