// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDwlHpTGv1NP93DxTNbMx09Nnz3YIFEAm8",
  authDomain: "studywithom.firebaseapp.com",
  projectId: "studywithom",
  storageBucket: "studywithom.firebasestorage.app",
  messagingSenderId: "745374680590",
  appId: "1:745374680590:web:cba7fe263951045f881e5f",
  measurementId: "G-NV5MG0N25Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore
const db = getFirestore(app);

export { db };