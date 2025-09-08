import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDRTblZCPQiy43gySE0sqfPsSL_nR5WM0Y",
  authDomain: "gemai-project-83ebe8.firebaseapp.com",
  projectId: "gemai-project-83ebe8",
  storageBucket: "gemai-project-83ebe8.appspot.com",
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
