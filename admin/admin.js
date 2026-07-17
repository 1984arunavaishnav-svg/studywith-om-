import { db, auth } from "../firebase/firebase-config.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

// ===========================
// START
// ===========================

console.log("StudyWithOm CMS Started");
console.log(db);
console.log(auth);

// ===========================
// ELEMENTS
// ===========================

const form = document.getElementById("contentForm");

const parent = document.getElementById("parent");
const type = document.getElementById("type");
const nameInput = document.getElementById("name");
const order = document.getElementById("order");
const status = document.getElementById("status");

// ===========================
// SAVE CONTENT
// ===========================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    if (nameInput.value.trim() === "") {
        alert("Please enter a name.");
        return;
    }

    const data = {

        name: nameInput.value.trim(),

        type: type.value,

        parentId: parent.value || null,

        order: Number(order.value) || 1,

        status: status.value === "Active",

        createdAt: serverTimestamp()

    };

    console.log("Saving...", data);

    try {

        const docRef = await addDoc(collection(db, "nodes"), data);

        console.log("Saved ID:", docRef.id);

        alert("Content Saved Successfully ✅");

        form.reset();

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

});