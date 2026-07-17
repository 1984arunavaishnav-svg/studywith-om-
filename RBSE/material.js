import { db } from "../firebase/firebase-config.js";

import {
    collection,
    getDocs,
    query,
    where,
    getDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


// ===========================
// GET URL PARAMS
// ===========================

const params = new URLSearchParams(window.location.search);

const chapterId = params.get("chapterId");

console.log("Chapter ID:", chapterId);


// ===========================
// ELEMENTS
// ===========================

const chapterTitle = document.getElementById("chapterTitle");

const lectureBtn = document.getElementById("lectureBtn");
const notesBtn = document.getElementById("notesBtn");
const pdfBtn = document.getElementById("pdfBtn");
const quizBtn = document.getElementById("quizBtn");


// ===========================
// LOAD CHAPTER NAME
// ===========================

async function loadChapter() {

    if (!chapterId) return;

    try {

        const chapterRef = doc(db, "nodes", chapterId);

        const snap = await getDoc(chapterRef);

        if (snap.exists()) {

            chapterTitle.innerHTML = snap.data().name;

        }

    } catch (error) {

        console.error(error);

    }

}


// ===========================
// LOAD MATERIALS
// ===========================

async function loadMaterials() {

    if (!chapterId) return;

    const q = query(

        collection(db, "materials"),

        where("chapterId", "==", chapterId)

    );

    const snap = await getDocs(q);

    console.log("Materials Found:", snap.size);

    snap.forEach((docSnap) => {

        const data = docSnap.data();

        console.log(data);

        switch (data.type) {

            case "Video":

                lectureBtn.onclick = () => {

                    window.open(data.url, "_blank");

                };

                break;

            case "Notes":

                notesBtn.onclick = () => {

                    window.open(data.url, "_blank");

                };

                break;

            case "PDF":

    pdfBtn.onclick = () => {

        window.location.href =
        `viewer/pdf-viewer.html?url=${encodeURIComponent(data.url)}&title=${encodeURIComponent(data.title)}`;

    };

break;

            case "Quiz":

                quizBtn.onclick = () => {

                    window.open(data.url, "_blank");

                };

                break;

        }

    });

}


// ===========================
// START
// ===========================

loadChapter();
loadMaterials();
