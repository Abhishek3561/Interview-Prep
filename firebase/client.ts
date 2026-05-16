// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1_gCjUWnsNKUYHeDxze5pEBFfSHRR2Uw",
  authDomain: "prepwise-7d342.firebaseapp.com",
  projectId: "prepwise-7d342",
  storageBucket: "prepwise-7d342.firebasestorage.app",
  messagingSenderId: "535157877796",
  appId: "1:535157877796:web:182c31e4704281d10a7cb1",
  measurementId: "G-8M1W6VZ818"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);