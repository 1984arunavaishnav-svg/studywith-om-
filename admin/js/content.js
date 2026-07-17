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
let tree;


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

    tree = document.getElementById("tree");


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

        loadTree();

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

}
// ======================================
// LOAD TREE
// ======================================

async function loadTree() {

    if (!tree) return;

    tree.innerHTML = "Loading...";

    try {

        const snap = await getDocs(
            collection(db, "nodes")
        );

        let nodes = [];

        snap.forEach((doc) => {

            nodes.push({

                id: doc.id,

                ...doc.data()

            });

        });

        nodes.sort((a, b) => {

            return (a.order || 0) - (b.order || 0);

        });

        tree.innerHTML = "";

        renderTree(null, 0, nodes);

    }

    catch (error) {

        console.error(error);

        tree.innerHTML = "Tree Load Error";

    }

}
// ======================================
// RENDER TREE
// ======================================

function renderTree(parentId, level, nodes) {

    nodes

    .filter(node => node.parentId === parentId)

    .forEach(node => {

        tree.innerHTML += `

        <div
        class="tree-item"
        style="margin-left:${level * 25}px">

            📁 ${node.name}

            <small>
                (${node.type})
            </small>

        </div>

        `;

        renderTree(

            node.id,

            level + 1,

            nodes

        );

    });

}