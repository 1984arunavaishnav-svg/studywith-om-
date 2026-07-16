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

    const chapters = rbseData[selectedClass].subjects[selectedSubject];

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