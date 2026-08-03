import { rbseData } from "./rbse-data.js";

const classSelect = document.getElementById("classSelect");
const subjectSelect = document.getElementById("subjectSelect");
const chapterSelect = document.getElementById("chapterSelect");

// Load Classes
function loadClasses() {
    classSelect.innerHTML = '<option value="">Choose Class</option>';

    Object.keys(rbseData).forEach(cls => {
        const option = document.createElement("option");
        option.value = cls;
        option.textContent = cls;
        classSelect.appendChild(option);
    });
}

// Load Subjects
classSelect.addEventListener("change", () => {

    subjectSelect.innerHTML = '<option value="">Choose Subject</option>';
    chapterSelect.innerHTML = '<option>Select Subject First</option>';
    chapterSelect.disabled = true;

    const selectedClass = classSelect.value;

    if (!selectedClass) {
        subjectSelect.disabled = true;
        return;
    }

    subjectSelect.disabled = false;

    Object.keys(rbseData[selectedClass].subjects).forEach(subject => {
        const option = document.createElement("option");
        option.value = subject;
        option.textContent = subject;
        subjectSelect.appendChild(option);
    });

});

// Load Chapters
subjectSelect.addEventListener("change", () => {

    chapterSelect.innerHTML = '<option value="">Choose Chapter</option>';

    const cls = classSelect.value;
    const sub = subjectSelect.value;

    if (!sub) {
        chapterSelect.disabled = true;
        return;
    }

    chapterSelect.disabled = false;

    Object.keys(rbseData[cls].subjects[sub]).forEach(chapter => {

        const option = document.createElement("option");
        option.value = chapter;
        option.textContent = chapter;
        chapterSelect.appendChild(option);

    });

});

// Open Lecture
chapterSelect.addEventListener("change", () => {

    const cls = classSelect.value;
    const sub = subjectSelect.value;
    const ch = chapterSelect.value;

    if (!ch) return;

    const data = rbseData[cls].subjects[sub][ch];

    console.log(data);

    // Example
    if (data.lecture !== "#") {
        window.location.href = data.lecture;
    }

});

loadClasses();
