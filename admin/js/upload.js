// =====================================
// StudyWithOm CMS
// Upload Module
// Part 1
// =====================================

export function initUpload() {

    console.log("Upload Module Loaded");

    initDropArea(
        "pdfDropArea",
        "pdfFile"
    );

    initDropArea(
        "videoDropArea",
        "videoFile"
    );

}


// =====================================
// DRAG & DROP
// =====================================

function initDropArea(dropId, inputId) {

    const dropArea =
    document.getElementById(dropId);

    const fileInput =
    document.getElementById(inputId);

    if (!dropArea || !fileInput) return;


    dropArea.addEventListener("click", () => {

        fileInput.click();

    });


    fileInput.addEventListener("change", () => {

        if (fileInput.files.length > 0) {

            showFileName(

                dropArea,

                fileInput.files[0]

            );

        }

    });


    dropArea.addEventListener("dragover", (e) => {

        e.preventDefault();

        dropArea.classList.add("dragover");

    });


    dropArea.addEventListener("dragleave", () => {

        dropArea.classList.remove("dragover");

    });


    dropArea.addEventListener("drop", (e) => {

        e.preventDefault();

        dropArea.classList.remove("dragover");

        fileInput.files =
        e.dataTransfer.files;

        showFileName(

            dropArea,

            e.dataTransfer.files[0]

        );

    });

}


// =====================================
// SHOW FILE NAME
// =====================================

function showFileName(

    dropArea,

    file

) {

    dropArea.querySelector("p").innerHTML =

        "Selected : " + file.name;

}