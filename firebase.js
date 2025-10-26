import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCg803JvOM35yHDGSXAMnGHvqgiksraZmk",
  authDomain: "inorganic-waste.firebaseapp.com",
  projectId: "inorganic-waste",
  storageBucket: "inorganic-waste.appspot.com",
  messagingSenderId: "335603313591",
  appId: "1:335603313591:web:854ff7233e0a33575c5632",
  measurementId: "G-C6Y1DJQP7W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
