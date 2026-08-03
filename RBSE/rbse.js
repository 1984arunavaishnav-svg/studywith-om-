import { rbseData } from "./rbse-data.js";

const searchInput = document.getElementById("searchInput");
const classSelect = document.getElementById("classSelect");
const subjectSelect = document.getElementById("subjectSelect");
const chapterSelect = document.getElementById("chapterSelect");

// =======================
// Load Classes
// =======================
function loadClasses() {
    classSelect.innerHTML = '<option value="">Choose Class</option>';

    Object.keys(rbseData).forEach(className => {
        const option = document.createElement("option");
        option.value = className;
        option.textContent = className;
        classSelect.appendChild(option);
    });
}

// =======================
// Class Change
// =======================
classSelect.addEventListener("change", () => {

    subjectSelect.innerHTML = '<option value="">Choose Subject</option>';
    chapterSelect.innerHTML = '<option value="">Select Subject First</option>';

    subjectSelect.disabled = true;
    chapterSelect.disabled = true;

    const selectedClass = classSelect.value;

    if (!selectedClass) return;

    Object.keys(rbseData[selectedClass].subjects).forEach(subject => {

        const option = document.createElement("option");
        option.value = subject;
        option.textContent = subject;
        subjectSelect.appendChild(option);

    });

    subjectSelect.disabled = false;
});

// =======================
// Subject Change
// =======================
subjectSelect.addEventListener("change", () => {

    chapterSelect.innerHTML = '<option value="">Choose Chapter</option>';

    chapterSelect.disabled = true;

    const selectedClass = classSelect.value;
    const selectedSubject = subjectSelect.value;

    if (!selectedSubject) return;

    Object.keys(rbseData[selectedClass].subjects[selectedSubject]).forEach(chapter => {

        const option = document.createElement("option");
        option.value = chapter;
        option.textContent = chapter;
        chapterSelect.appendChild(option);

    });

    chapterSelect.disabled = false;

});

// =======================
// Chapter Change
// =======================
chapterSelect.addEventListener("change", () =>
