import {
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { auth } from "../config/firebase";

//^ Sign out user
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

//^ Auth state observer
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

//^ Add Google Sign In (Popup + Redirect fallback)
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();

    // 🔹 Try popup first
    const userCredential = await signInWithPopup(auth, provider);
    return { user: userCredential.user, error: null };
  } catch (popupError) {
    console.warn("Popup failed, falling back to redirect:", popupError.message);

    try {
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);

      // After redirect, Firebase restores the user automatically
      const result = await getRedirectResult(auth);
      if (result?.user) {
        return { user: result.user, error: null };
      }
      return { user: null, error: null };
    } catch (redirectError) {
      return { user: null, error: redirectError.message };
    }
  }
};
