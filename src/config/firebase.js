import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDWlQ5YA_tNZm6mcmZ7o5SLZGmcjQexcoI",
  authDomain: "ai-content-generator-449f4.firebaseapp.com",   // ✅ correct
  projectId: "ai-content-generator-449f4",
  storageBucket: "ai-content-generator-449f4.appspot.com",    // ✅ fixed
  messagingSenderId: "485650436246",
  appId: "1:485650436246:web:2540c3c1000f0c857372b7"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export services
export const auth = getAuth(app);
export const db = getFirestore(app);

// ✅ Set persistence so login survives refresh
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.error("Error setting persistence", err);
});
