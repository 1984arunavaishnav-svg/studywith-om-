import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDwlHpTGv1NP93DxTNbMx09Nnz3YIFEAm8",
  authDomain: "studywithom.firebaseapp.com",
  projectId: "studywithom",
  storageBucket: "studywithom.firebasestorage.app",
  messagingSenderId: "745374680590",
  appId: "1:745374680590:web:cba7fe263951045f881e5f",
  measurementId: "G-NV5MG0N25Y"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };