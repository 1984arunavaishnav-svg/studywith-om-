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
