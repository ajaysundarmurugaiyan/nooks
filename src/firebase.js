// src/config/firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, getDoc, setDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBw3GNsqdTxLqXzd4Hj3PMOb7cmOpcDI2Y",
  authDomain: "nooks1.firebaseapp.com",
  projectId: "nooks1",
  storageBucket: "nooks1.appspot.com",
  messagingSenderId: "736225132700",
  appId: "1:736225132700:web:0c8fb9319a486a64e92d59",
  measurementId: "G-G67HQK06W8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);  // Initialize Storage


// Exporting necessary functions and instances
export { 
  collection, 
  addDoc, 
  getDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  analytics, 
  auth, 
  setDoc, 
};
export { db, storage };
export { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";




