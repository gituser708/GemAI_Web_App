import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDWlQ5YA_tNZm6mcmZ7o5SLZGmcjQexcoI",
  authDomain: "ai-content-generator-449f4.firebaseapp.com",
  projectId: "ai-content-generator-449f4",
  storageBucket: "ai-content-generator-449f4.firebasestorage.app",
  messagingSenderId: "485650436246",
  appId: "1:485650436246:web:2540c3c1000f0c857372b7"
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);


setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.error("Error setting persistence", err);
});
