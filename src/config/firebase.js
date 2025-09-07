import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBMwCwi0tJ5iq4EGwHkoa9uYMWCc5urPoY",
    authDomain: "gemai-project-3bbe8.firebaseapp.com",
    projectId: "gemai-project-3bbe8",
    storageBucket: "gemai-project-3bbe8.firebasestorage.app",
    messagingSenderId: "859213360282",
    appId: "1:859213360282:web:8360dc6bedf6a123b84323",
    measurementId: "G-C1YHE80GL8"
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);


setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.error("Error setting persistence", err);
});
