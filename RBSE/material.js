import { rbseData } from "./rbse-data.js";

// ===========================
// GET URL PARAMS
// ===========================

const params = new URLSearchParams(window.location.search);

const className = params.get("class");
const subjectName = params.get("subject");
const chapterName = params.get("chapter");

// ===========================
// ELEMENTS
// ===========================

const chapterTitle = document.getElementById("chapterTitle");

const lectureBtn = document.getElementById("lectureBtn");
const notesBtn = document.getElementById("notesBtn");
const pdfBtn = document.getElementById("pdfBtn");
const quizBtn = document.getElementById("quizBtn");

// ===========================
// LOAD DATA
// ===========================

if (
    !className ||
    !subjectName ||
    !chapterName ||
    !rbseData[className] ||
    !rbseData[className].subjects[subjectName] ||
    !rbseData[className].subjects[subjectName][chapterName]
) {

    chapterTitle.textContent = "Chapter Not Found";

    lectureBtn.disabled = true;
    notesBtn.disabled = true;
    pdfBtn.disabled = true;
    quizBtn.disabled = true;

    throw new Error("Invalid Chapter");

}

const data =
    rbseData[className]
    .subjects[subjectName]
    [chapterName];

// ===========================
// TITLE
// ===========================

chapterTitle.textContent = chapterName;

// ===========================
// BUTTONS
// ===========================

// VIDEO
lectureBtn.onclick = () => {

    if (!data.lecture || data.lecture === "#") {
        alert("Lecture Coming Soon");
        return;
    }

const videoUrl =
    `${window.location.origin}/studywith-om-/RBSE/${data.lecture}`;

window.location.href =
`/studywith-om-/viewer/video-player.html?url=${encodeURIComponent(videoUrl)}&title=${encodeURIComponent(chapterName)}`;



//
