const classSelect = document.getElementById("classSelect");
const subjectSelect = document.getElementById("subjectSelect");

classSelect.addEventListener("change", function () {

    subjectSelect.innerHTML = "";

    const selectedClass = this.value;

    if (selectedClass === "") {
        subjectSelect.disabled = true;
        subjectSelect.innerHTML = "<option>Select Class First</option>";
        return;
    }

    subjectSelect.disabled = false;

    const subjects = rbseData[selectedClass].subjects;

    subjectSelect.innerHTML = "<option value=''>Choose Subject</option>";

    subjects.forEach(subject => {

        subjectSelect.innerHTML += `
            <option>${subject}</option>
        `;

    });

});
const chapterSelect = document.getElementById("chapterSelect");

subjectSelect.addEventListener("change", function () {

    chapterSelect.innerHTML = "";

    const selectedClass = classSelect.value;
    const selectedSubject = this.value;

    if (selectedSubject === "") {
        chapterSelect.disabled = true;
        chapterSelect.innerHTML = "<option>Select Subject First</option>";
        return;
    }

    chapterSelect.disabled = false;

    const chapters = rbseData[selectedClass].subjects[selectedSubject];

    chapterSelect.innerHTML = "<option value=''>Choose Chapter</option>";

    chapters.forEach(chapter => {
        chapterSelect.innerHTML += `<option>${chapter}</option>`;
    });

});
