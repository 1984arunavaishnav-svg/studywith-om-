const classSelect = document.getElementById("classSelect");
const subjectSelect = document.getElementById("subjectSelect");
const chapterSelect = document.getElementById("chapterSelect");

classSelect.addEventListener("change", function () {

    subjectSelect.innerHTML = "";
    chapterSelect.innerHTML = "<option>Select Subject First</option>";
    chapterSelect.disabled = true;

    const selectedClass = this.value;

    if (selectedClass === "") {
        subjectSelect.disabled = true;
        subjectSelect.innerHTML = "<option>Select Class First</option>";
        return;
    }

    subjectSelect.disabled = false;

    const subjects = rbseData[selectedClass].subjects;

    subjectSelect.innerHTML = "<option value=''>Choose Subject</option>";

    Object.keys(subjects).forEach(subject => {
        subjectSelect.innerHTML += `<option>${subject}</option>`;
    });

});

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

   const chapters = Object.keys(rbseData[selectedClass].subjects[selectedSubject]);
    chapterSelect.innerHTML = "<option value=''>Choose Chapter</option>";

    chapters.forEach(chapter => {
        chapterSelect.innerHTML += `<option>${chapter}</option>`;
    });

});
const contentArea = document.getElementById("contentArea");

chapterSelect.addEventListener("change", function(){

    if(this.value===""){
        contentArea.style.display="none";
    }else{
        contentArea.style.display="block";
    }

});
const lectureCard = document.getElementById("lectureCard");
const notesCard = document.getElementById("notesCard");
const pdfCard = document.getElementById("pdfCard");
const quizCard = document.getElementById("quizCard");

chapterSelect.addEventListener("change", function () {

    if (this.value === "") return;

    const data =
        rbseData[classSelect.value]
        .subjects[subjectSelect.value]
        [this.value];

    lectureCard.onclick = () => window.location.href = data.lecture;
    notesCard.onclick   = () => window.location.href = data.notes;
    pdfCard.onclick     = () => window.location.href = data.pdf;
    quizCard.onclick    = () => window.location.href = data.quiz;

});