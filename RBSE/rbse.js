import { db } from "../firebase/firebase-config.js";

import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const classSelect = document.getElementById("classSelect");
const subjectSelect = document.getElementById("subjectSelect");
const chapterSelect = document.getElementById("chapterSelect");

// ==========================
// LOAD CLASSES
// ==========================

async function loadClasses() {

    classSelect.innerHTML =
        `<option value="">Choose Class</option>`;

    try {

        // Find Board = RBSE
        const boardQuery = query(
            collection(db, "nodes"),
            where("type", "==", "Board"),
            where("name", "==", "RBSE")
        );

        const boardSnap = await getDocs(boardQuery);

        if (boardSnap.empty) {
            alert("RBSE Board not found.");
            return;
        }

        const boardId = boardSnap.docs[0].id;

        // Find Classes under RBSE
        const classQuery = query(
            collection(db, "nodes"),
            where("type", "==", "Class"),
            where("parentId", "==", boardId)
        );

        const classSnap = await getDocs(classQuery);

        classSnap.forEach((doc) => {

            const item = doc.data();

            classSelect.innerHTML += `
                <option value="${doc.id}">
                    ${item.name}
                </option>
            `;

        });

        console.log("Classes Loaded:", classSnap.size);

    }
    catch (error) {

        console.error(error);

    }

}

loadClasses();
// ==========================
// LOAD SUBJECTS
// ==========================

classSelect.addEventListener("change", async function () {

    subjectSelect.innerHTML =
        `<option value="">Choose Subject</option>`;

    chapterSelect.innerHTML =
        `<option value="">Choose Chapter</option>`;

    chapterSelect.disabled = true;

    if (this.value === "") {
        subjectSelect.disabled = true;
        return;
    }

    subjectSelect.disabled = false;

    const q = query(
        collection(db, "nodes"),
        where("type", "==", "Subject"),
        where("parentId", "==", this.value)
    );

    const snap = await getDocs(q);

    console.log("Subjects Loaded:", snap.size);

    snap.forEach((doc) => {

        const item = doc.data();

        subjectSelect.innerHTML += `
            <option value="${doc.id}">
                ${item.name}
            </option>
        `;

    });

});
// ==========================
// LOAD CHAPTERS
// ==========================

subjectSelect.addEventListener("change", async function () {

    chapterSelect.innerHTML =
        `<option value="">Choose Chapter</option>`;

    if (this.value === "") {
        chapterSelect.disabled = true;
        return;
    }

    chapterSelect.disabled = false;

    const q = query(
        collection(db, "nodes"),
        where("type", "==", "Chapter"),
        where("parentId", "==", this.value)
    );

    const snap = await getDocs(q);

    console.log("Chapters Loaded:", snap.size);

    snap.forEach((doc) => {

        const item = doc.data();

        chapterSelect.innerHTML += `
            <option value="${doc.id}">
                ${item.name}
            </option>
        `;

    });

});   // ⭐⭐⭐ यह line missing थी


chapterSelect.addEventListener("change", function () {

    if (this.value === "") return;

    window.location.href =
        `material.html?chapterId=${this.value}`;

});