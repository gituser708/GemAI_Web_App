import {
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { auth } from "../config/firebase";

// 🔹 Sign out user
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// 🔹 Auth state observer
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

// 🔹 Google Sign-In with popup → redirect fallback
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();

  try {
    const userCredential = await signInWithPopup(auth, provider);
    return { user: userCredential.user, error: null };
  } catch (popupError) {
    console.warn("Popup failed, falling back to redirect:", popupError.message);

    try {
      await signInWithRedirect(auth, provider);
      // Redirect will navigate away; result handled separately
      return { user: null, error: null };
    } catch (redirectError) {
      return { user: null, error: redirectError.message };
    }
  }
};

// 🔹 Handle redirect result (call on page load)
export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      return { user: result.user, error: null };
    }
    return { user: null, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};
