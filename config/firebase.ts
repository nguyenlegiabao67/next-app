// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAP2mjdmHhs_EL2Zhpp1urYVAGzv66fJg8",
  authDomain: "next-chat-app-35e31.firebaseapp.com",
  projectId: "next-chat-app-35e31",
  storageBucket: "next-chat-app-35e31.appspot.com",
  messagingSenderId: "88894563612",
  appId: "1:88894563612:web:9305291e252dce567046d9",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { db, auth, provider };
