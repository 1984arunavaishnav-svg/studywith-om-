// ======================================
// StudyWithOm CMS
// Content Manager
// Part 1
// ======================================

import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    addDoc,
    serverTimestamp,
    query,
    where
}
from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


// ======================================
// Elements
// ======================================

let form;
let parentSelect;
let typeSelect;
let nameInput;
let orderInput;
let statusSelect;


// Parent Type Mapping

const parentMap = {

    Category: null,

    Board: "Category",

    Class: "Board",

    Subject: "Class",

    Chapter: "Subject"

};


// ======================================
// INIT
// ======================================

export function initContent() {

    console.log("Content Module Loaded");

    form = document.getElementById("contentForm");

    parentSelect = document.getElementById("parent");

    typeSelect = document.getElementById("type");

    nameInput = document.getElementById("name");

    orderInput = document.getElementById("order");

    statusSelect = document.getElementById("status");


    if (!form) {

        console.error("Content Form Not Found");

        return;

    }

    loadParents();

    typeSelect.addEventListener(

        "change",

        loadParents

    );
    form.addEventListener(
    "submit",
    saveContent
);

}
// ======================================
// LOAD PARENTS
// ======================================

async function loadParents() {

    parentSelect.innerHTML =

        `<option value="">None (Root Category)</option>`;

    const needParent = parentMap[typeSelect.value];

    if (!needParent) return;

    try {

        const q = query(

            collection(db, "nodes"),

            where("type", "==", needParent)

        );

        const snap = await getDocs(q);

        snap.forEach((doc) => {

            const item = doc.data();

            parentSelect.innerHTML += `

            <option value="${doc.id}">

                ${item.name}

            </option>

            `;

        });

        console.log(

            "Parents Loaded:",

            snap.size

        );

    }

    catch (error) {

        console.error(

            "Parent Load Error",

            error

        );

    }

}
// ======================================
// SAVE CONTENT
// ======================================

async function saveContent(e) {

    e.preventDefault();

    const name = nameInput.value.trim();

    if (name === "") {

        alert("Please enter name");

        return;

    }

    const data = {

        name: name,

        type: typeSelect.value,

        parentId: parentSelect.value || null,

        order: Number(orderInput.value) || 1,

        status: statusSelect.value === "Active",

        createdAt: serverTimestamp()

    };

    console.log("Saving...", data);

    try {

        const docRef = await addDoc(

            collection(db, "nodes"),

            data

        );

        console.log(

            "Saved Successfully:",

            docRef.id

        );

        alert("Content Saved");

        form.reset();

        loadParents();

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

}