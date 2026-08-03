import { rbseData } from "./rbse-data.js";

const searchInput = document.getElementById("searchInput");
const classSelect = document.getElementById("classSelect");
const subjectSelect = document.getElementById("subjectSelect");
const chapterSelect = document.getElementById("chapterSelect");

// ----------------------------
// Load Classes
// ----------------------------
function loadClasses() {

    classSelect.innerHTML = '<option value="">Choose Class</option>';

    Object.keys(rbseData).forEach(className => {

        const option = document.createElement("option");

        option.value = className;
        option.textContent = className;

        classSelect.appendChild(option);

    });

}

loadClasses();

// ----------------------------
// Class Change
// ----------------------------
classSelect.addEventListener("change", () => {

    subjectSelect.innerHTML =
        '<option value="">Choose Subject</option>';

    chapterSelect.innerHTML =
        '<option value="">Select Subject First</option>';

    subjectSelect.disabled = true;
    chapterSelect.disabled = true;

    const className = classSelect.value;

    if (!className) return;

    const subjects = rbseData[className].subjects;

    Object.keys(subjects).forEach(subject => {

        const option = document.createElement("option");

        option.value = subject;
        option.textContent = subject;

        subjectSelect.appendChild(option);

    });

    subjectSelect.disabled = false;

});

// ----------------------------
// Subject Change
// ----------------------------
subjectSelect.addEventListener("change", () => {

    chapterSelect.innerHTML =
        '<option value="">Choose Chapter</option>';

    chapterSelect.disabled = true;

    const className = classSelect.value;
    const subjectName = subjectSelect.value;

    if (!subjectName) return;

    const chapters =
        rbseData[className].subjects[subjectName];

    Object.keys(chapters).forEach(chapter => {

        const option = document.createElement("option");

        option.value = chapter;
        option.textContent = chapter;

        chapterSelect.appendChild(option);

    });

    chapterSelect.disabled = false;

});

// ----------------------------
// Chapter Change
// ----------------------------
chapterSelect.addEventListener("change", () => {

    const className = classSelect.value;
    const subjectName = subjectSelect.value;
    const chapterName = chapterSelect.value;

    if (!chapterName) return;

    const url =
        `material.html?class=${encodeURIComponent(className)}&subject=${encodeURIComponent(subjectName)}&chapter=${encodeURIComponent(chapterName)}`;

    window.location.href = url;

});

// ----------------------------
// Search
// ----------------------------
searchInput.addEventListener("input", () => {

    const keyword = searchInput.value.toLowerCase();

    // Search Classes
    if (!classSelect.value) {

        classSelect.innerHTML =
            '<option value="">Choose Class</option>';

        Object.keys(rbseData).forEach(className => {

            if (className.toLowerCase().includes(keyword)) {

                const option = document.createElement("option");

                option.value = className;
                option.textContent = className;

                classSelect.appendChild(option);

            }

        });

        return;

    }

    // Search Subjects
    if (classSelect.value && !subjectSelect.value) {

        subjectSelect.innerHTML =
            '<option value="">Choose Subject</option>';

        Object.keys(rbseData[classSelect.value].subjects)
            .forEach(subject => {

                if (subject.toLowerCase().includes(keyword)) {

                    const option =
                        document.createElement("option");

                    option.value = subject;
                    option.textContent = subject;

                    subjectSelect.appendChild(option);

                }

            });

        return;

    }

    // Search Chapters
    if (classSelect.value && subjectSelect.value) {

        chapterSelect.innerHTML =
            '<option value="">Choose Chapter</option>';

        Object.keys(
            rbseData[classSelect.value]
            .subjects[subjectSelect.value]
        ).forEach(chapter => {

            if (chapter.toLowerCase().includes(keyword)) {

                const option =
                    document.createElement("option");

                option.value = chapter;
                option.textContent = chapter;

                chapterSelect.appendChild(option);

            }

        });

    }

});
