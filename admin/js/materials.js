/* ==========================================================
   StudyWithOm CMS
   File : materials.js
   Part : 1
   Module : Material Manager
========================================================== */

import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    query,
    where,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/* ==========================================================
   CLOUDINARY CONFIG
========================================================== */

const CLOUDINARY_CLOUD_NAME = "abzhlo3h";
const CLOUDINARY_UPLOAD_PRESET = "studywithom";


/* ==========================================================
   GLOBAL VARIABLES
========================================================== */

let currentMaterialId = null;
let selectedFile = null;
let uploadedFileURL = "";
let uploadedPublicId = "";
let editor = null;


/* ==========================================================
   DOM ELEMENTS
========================================================== */

const chapterSelect = document.getElementById("chapterSelect");

const materialType = document.getElementById("materialType");

const saveMaterialBtn = document.getElementById("saveMaterial");


/* ---------- PDF ---------- */

const pdfSection = document.getElementById("pdfSection");

const pdfTitle = document.getElementById("pdfTitle");

const pdfDropArea = document.getElementById("pdfDropArea");

const pdfFile = document.getElementById("pdfFile");


/* ---------- VIDEO ---------- */

const videoSection = document.getElementById("videoSection");

const videoTitle = document.getElementById("videoTitle");

const videoDropArea = document.getElementById("videoDropArea");

const videoFile = document.getElementById("videoFile");


/* ---------- NOTES ---------- */

const notesSection = document.getElementById("notesSection");

const notesTitle = document.getElementById("notesTitle");


/* ---------- QUIZ ---------- */

const quizSection = document.getElementById("quizSection");

const quizTitle = document.getElementById("quizTitle");

const addQuestionBtn = document.getElementById("addQuestion");

const questionsBox = document.getElementById("questionsBox");


/* ==========================================================
   QUILL EDITOR
========================================================== */

function initEditor() {

    if (editor) return;

    editor = new Quill("#editor", {

        theme: "snow",

        placeholder: "Write Notes Here...",

        modules: {

            toolbar: [

                [{ header: [1,2,3,false] }],

                ["bold","italic","underline"],

                [{ list:"ordered" }],

                [{ list:"bullet" }],

                ["link"],

                ["clean"]

            ]

        }

    });

}


/* ==========================================================
   INITIALIZE
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initEditor();

});
/* ==========================================================
   LOAD CHAPTERS FROM FIRESTORE
========================================================== */

async function loadChapters() {

    try {

        chapterSelect.innerHTML = `
            <option value="">
                Select Chapter
            </option>
        `;

        const q = query(
            collection(db, "content"),
            where("type", "==", "Chapter"),
            orderBy("order")
        );

        const snapshot = await getDocs(q);

        snapshot.forEach((docSnap) => {

            const chapter = docSnap.data();

            const option = document.createElement("option");

            option.value = docSnap.id;

            option.textContent = chapter.name;

            chapterSelect.appendChild(option);

        });

    }

    catch (error) {

        console.error("Chapter Load Error :", error);

        alert("Unable to load chapters.");

    }

}


/* ==========================================================
   REFRESH CHAPTER LIST
========================================================== */

async function refreshChapterList() {

    await loadChapters();

}


/* ==========================================================
   GET SELECTED CHAPTER
========================================================== */

function getSelectedChapter() {

    return chapterSelect.value;

}


/* ==========================================================
   VALIDATE CHAPTER
========================================================== */

function validateChapter() {

    if (!chapterSelect.value) {

        alert("Please Select Chapter");

        chapterSelect.focus();

        return false;

    }

    return true;

}


/* ==========================================================
   INITIAL LOAD
========================================================== */

document.addEventListener("DOMContentLoaded", async () => {

    await loadChapters();

});
/* ==========================================================
   MATERIAL TYPE UI CONTROLLER
========================================================== */

function hideAllMaterialSections() {

    pdfSection.style.display = "none";
    videoSection.style.display = "none";
    notesSection.style.display = "none";
    quizSection.style.display = "none";

}



/* ==========================================================
   SHOW SELECTED SECTION
========================================================== */

function showSelectedMaterial() {

    hideAllMaterialSections();

    switch (materialType.value) {

        case "PDF":

            pdfSection.style.display = "block";

            break;


        case "Video":

            videoSection.style.display = "block";

            break;


        case "Notes":

            notesSection.style.display = "block";

            break;


        case "Quiz":

            quizSection.style.display = "block";

            break;

    }

}



/* ==========================================================
   RESET FORM
========================================================== */

function resetMaterialForm() {

    pdfTitle.value = "";

    videoTitle.value = "";

    notesTitle.value = "";

    quizTitle.value = "";

    selectedFile = null;

    uploadedFileURL = "";

    uploadedPublicId = "";

    currentMaterialId = null;

    chapterSelect.selectedIndex = 0;

    materialType.selectedIndex = 0;

    hideAllMaterialSections();

    if (editor) {

        editor.setContents([]);

    }

    questionsBox.innerHTML = "";

}



/* ==========================================================
   VALIDATE MATERIAL TYPE
========================================================== */

function validateMaterialType() {

    if (materialType.value === "") {

        alert("Please Select Material Type");

        materialType.focus();

        return false;

    }

    return true;

}



/* ==========================================================
   MATERIAL TITLE
========================================================== */

function getMaterialTitle() {

    switch (materialType.value) {

        case "PDF":

            return pdfTitle.value.trim();


        case "Video":

            return videoTitle.value.trim();


        case "Notes":

            return notesTitle.value.trim();


        case "Quiz":

            return quizTitle.value.trim();

    }

    return "";

}



/* ==========================================================
   TITLE VALIDATION
========================================================== */

function validateTitle() {

    if (getMaterialTitle() === "") {

        alert("Please Enter Title");

        return false;

    }

    return true;

}



/* ==========================================================
   EVENTS
========================================================== */

materialType.addEventListener(

    "change",

    showSelectedMaterial

);



/* ==========================================================
   INITIAL UI
========================================================== */

hideAllMaterialSections();
/* ==========================================================
   FILE UPLOAD SYSTEM
========================================================== */

let currentUploadType = "";



/* ==========================================================
   PDF SELECT
========================================================== */

pdfDropArea.addEventListener("click", () => {

    pdfFile.click();

});



pdfFile.addEventListener("change", () => {

    if (!pdfFile.files.length) return;

    selectedFile = pdfFile.files[0];

    currentUploadType = "raw";

    pdfDropArea.querySelector("p").innerHTML =
        "Selected : " + selectedFile.name;

});



/* ==========================================================
   VIDEO SELECT
========================================================== */

videoDropArea.addEventListener("click", () => {

    videoFile.click();

});



videoFile.addEventListener("change", () => {

    if (!videoFile.files.length) return;

    selectedFile = videoFile.files[0];

    currentUploadType = "video";

    videoDropArea.querySelector("p").innerHTML =
        "Selected : " + selectedFile.name;

});



/* ==========================================================
   DRAG & DROP
========================================================== */

function enableDragDrop(area, input, type) {

    area.addEventListener("dragover", (e) => {

        e.preventDefault();

        area.classList.add("dragover");

    });

    area.addEventListener("dragleave", () => {

        area.classList.remove("dragover");

    });

    area.addEventListener("drop", (e) => {

        e.preventDefault();

        area.classList.remove("dragover");

        input.files = e.dataTransfer.files;

        selectedFile = input.files[0];

        currentUploadType = type;

        area.querySelector("p").innerHTML =
            "Selected : " + selectedFile.name;

    });

}



enableDragDrop(

    pdfDropArea,

    pdfFile,

    "raw"

);



enableDragDrop(

    videoDropArea,

    videoFile,

    "video"

);



/* ==========================================================
   FILE VALIDATION
========================================================== */

function validateFile() {

    if (

        materialType.value === "PDF" ||

        materialType.value === "Video"

    ) {

        if (!selectedFile) {

            alert("Please Select File");

            return false;

        }

    }

    return true;

}



/* ==========================================================
   FILE PREVIEW
========================================================== */

function showFilePreview() {

    if (!selectedFile) return;

    console.log("Name :", selectedFile.name);

    console.log("Size :", selectedFile.size);

    console.log("Type :", selectedFile.type);

}



/* ==========================================================
   RESET FILE
========================================================== */

function resetFile() {

    selectedFile = null;

    uploadedFileURL = "";

    uploadedPublicId = "";

    currentUploadType = "";

    pdfFile.value = "";

    videoFile.value = "";

    pdfDropArea.querySelector("p").innerHTML =
        "Click or Drag PDF";

    videoDropArea.querySelector("p").innerHTML =
        "Click or Drag Video";

}



/* ==========================================================
   PART 4 COMPLETE
========================================================== */

console.log("Materials.js Part 4 Loaded");
/* ==========================================================
   CLOUDINARY UPLOAD
========================================================== */

async function uploadToCloudinary() {

    if (!selectedFile) {

        return null;

    }

    try {

        const formData = new FormData();

        formData.append("file", selectedFile);

        formData.append(
            "upload_preset",
            CLOUDINARY_UPLOAD_PRESET
        );

        const resourceType =

            currentUploadType === "video"

                ? "video"

                : "raw";

        const response = await fetch(

            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,

            {

                method: "POST",

                body: formData

            }

        );

        if (!response.ok) {

            throw new Error("Upload Failed");

        }

        const data = await response.json();

        uploadedFileURL = data.secure_url;

        uploadedPublicId = data.public_id;

        console.log("Upload Success");

        console.log(uploadedFileURL);

        return {

            url: uploadedFileURL,

            publicId: uploadedPublicId,

            bytes: data.bytes,

            format: data.format,

            originalName: data.original_filename

        };

    }

    catch (error) {

        console.error(error);

        alert("Cloudinary Upload Failed");

        return null;

    }

}



/* ==========================================================
   FILE UPLOAD VALIDATION
========================================================== */

async function uploadSelectedMaterial() {

    if (

        materialType.value === "PDF" ||

        materialType.value === "Video"

    ) {

        const upload =

            await uploadToCloudinary();

        if (!upload) {

            return false;

        }

    }

    return true;

}



/* ==========================================================
   UPLOAD STATUS
========================================================== */

function setUploadButtonLoading(status) {

    if (status) {

        saveMaterialBtn.disabled = true;

        saveMaterialBtn.innerHTML =

            '<i class="fa-solid fa-spinner fa-spin"></i> Uploading...';

    }

    else {

        saveMaterialBtn.disabled = false;

        saveMaterialBtn.innerHTML =

            "Save Material";

    }

}



/* ==========================================================
   PART 5 COMPLETE
========================================================== */

console.log("Materials.js Part 5 Loaded");
/* ==========================================================
   SAVE MATERIAL TO FIRESTORE
========================================================== */

async function saveMaterialData() {

    try {

        setUploadButtonLoading(true);

        if (!validateChapter()) {

            setUploadButtonLoading(false);

            return;

        }

        if (!validateMaterialType()) {

            setUploadButtonLoading(false);

            return;

        }

        if (!validateTitle()) {

            setUploadButtonLoading(false);

            return;

        }

        if (!validateFile()) {

            setUploadButtonLoading(false);

            return;

        }



        // ======================================
        // Upload PDF / Video To Cloudinary
        // ======================================

        const uploadSuccess =

            await uploadSelectedMaterial();

        if (!uploadSuccess) {

            setUploadButtonLoading(false);

            return;

        }



        // ======================================
        // Notes Content
        // ======================================

        let notesContent = "";

        if (

            materialType.value === "Notes"

            &&

            editor

        ) {

            notesContent =

                editor.root.innerHTML;

        }



        // ======================================
        // Quiz Data
        // ======================================

        let quizData = [];



        document

        .querySelectorAll(".quiz-question")

        .forEach(item => {

            quizData.push({

                question:

                item.querySelector(".question")

                ?.value || "",

                option1:

                item.querySelector(".option1")

                ?.value || "",

                option2:

                item.querySelector(".option2")

                ?.value || "",

                option3:

                item.querySelector(".option3")

                ?.value || "",

                option4:

                item.querySelector(".option4")

                ?.value || "",

                answer:

                item.querySelector(".answer")

                ?.value || ""

            });

        });



        // ======================================
        // Firestore Object
        // ======================================

        const material = {

            chapterId:

            chapterSelect.value,

            type:

            materialType.value,

            title:

            getMaterialTitle(),

            fileURL:

            uploadedFileURL,

            publicId:

            uploadedPublicId,

            notes:

            notesContent,

            quiz:

            quizData,

            status:

            "Active",

            createdAt:

            serverTimestamp(),

            updatedAt:

            serverTimestamp()

        };



        // ======================================
        // Add New Material
        // ======================================

        await addDoc(

            collection(

                db,

                "materials"

            ),

            material

        );



        alert(

            "Material Saved Successfully"

        );



        resetMaterialForm();

        resetFile();



        await loadMaterials();



    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

    finally {

        setUploadButtonLoading(false);

    }

}



/* ==========================================================
   SAVE BUTTON
========================================================== */

saveMaterialBtn.addEventListener(

    "click",

    saveMaterialData

);



/* ==========================================================
   PART 6 COMPLETE
========================================================== */

console.log(

    "Materials.js Part 6 Loaded"

);
/* ==========================================================
   LOAD ALL MATERIALS
========================================================== */

let materials = [];



async function loadMaterials() {

    try {

        materials = [];

        const snapshot = await getDocs(

            query(

                collection(db, "materials"),

                orderBy("createdAt", "desc")

            )

        );



        snapshot.forEach((docSnap) => {

            materials.push({

                id: docSnap.id,

                ...docSnap.data()

            });

        });



        renderMaterials();

    }

    catch (error) {

        console.error(error);

    }

}



/* ==========================================================
   RENDER MATERIAL LIST
========================================================== */

function renderMaterials() {

    let container =

        document.getElementById("materialsList");



    if (!container) {

        container = document.createElement("div");

        container.id = "materialsList";

        container.style.marginTop = "30px";



        document

            .querySelector(".material-form")

            .appendChild(container);

    }



    container.innerHTML = "";



    if (materials.length === 0) {

        container.innerHTML =

        `

        <div class="empty-material">

            No Materials Found

        </div>

        `;

        return;

    }



    materials.forEach((item) => {

        container.innerHTML += `

        <div class="material-card">

            <div class="material-left">

                <h4>${item.title}</h4>

                <p>${item.type}</p>

            </div>



            <div class="material-right">

                <button

                    class="editMaterial"

                    data-id="${item.id}"

                >

                    <i class="fa-solid fa-pen"></i>

                    Edit

                </button>



                <button

                    class="deleteMaterial"

                    data-id="${item.id}"

                >

                    <i class="fa-solid fa-trash"></i>

                    Delete

                </button>

            </div>

        </div>

        `;

    });



    attachMaterialEvents();

}



/* ==========================================================
   ATTACH EVENTS
========================================================== */

function attachMaterialEvents() {

    document

        .querySelectorAll(".editMaterial")

        .forEach((btn) => {

            btn.onclick = () => {

                editMaterial(

                    btn.dataset.id

                );

            };

        });



    document

        .querySelectorAll(".deleteMaterial")

        .forEach((btn) => {

            btn.onclick = () => {

                deleteMaterial(

                    btn.dataset.id

                );

            };

        });

}



/* ==========================================================
   AUTO LOAD
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    loadMaterials

);



/* ==========================================================
   PART 7A COMPLETE
========================================================== */

console.log(

    "Materials.js Part 7A Loaded"

);
/* ==========================================================
   EDIT MATERIAL
========================================================== */

async function editMaterial(id){

    try{

        const material = materials.find(item => item.id === id);

        if(!material){

            alert("Material Not Found");

            return;

        }

        currentMaterialId = id;

        chapterSelect.value = material.chapterId;

        materialType.value = material.type;

        showSelectedMaterial();

        switch(material.type){

            case "PDF":

                pdfTitle.value = material.title || "";

                break;

            case "Video":

                videoTitle.value = material.title || "";

                break;

            case "Notes":

                notesTitle.value = material.title || "";

                if(editor){

                    editor.root.innerHTML = material.notes || "";

                }

                break;

            case "Quiz":

                quizTitle.value = material.title || "";

                loadQuiz(material.quiz || []);

                break;

        }

        uploadedFileURL = material.fileURL || "";

        uploadedPublicId = material.publicId || "";

        saveMaterialBtn.innerHTML =

        '<i class="fa-solid fa-floppy-disk"></i> Update Material';

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    }

    catch(error){

        console.error(error);

    }

}



/* ==========================================================
   DELETE MATERIAL
========================================================== */

async function deleteMaterial(id){

    try{

        const ok = confirm(

            "Delete this material?"

        );

        if(!ok) return;

        await deleteDoc(

            doc(

                db,

                "materials",

                id

            )

        );

        materials = materials.filter(

            item => item.id !== id

        );

        renderMaterials();

        alert("Material Deleted");

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}



/* ==========================================================
   UPDATE MATERIAL
========================================================== */

async function updateMaterial(data){

    try{

        await updateDoc(

            doc(

                db,

                "materials",

                currentMaterialId

            ),

            data

        );

        alert("Material Updated");

        currentMaterialId = null;

        saveMaterialBtn.innerHTML =

        "Save Material";

        resetMaterialForm();

        resetFile();

        loadMaterials();

    }

    catch(error){

        console.error(error);

    }

}



/* ==========================================================
   QUIZ LOADER
========================================================== */

function loadQuiz(quiz=[]){

    questionsBox.innerHTML="";

    quiz.forEach(q=>{

        addQuizQuestion(q);

    });

}



/* ==========================================================
   PART 7B COMPLETE
========================================================== */

console.log("Materials.js Part 7B Loaded");
/* ==========================================================
   MATERIAL VALIDATION
========================================================== */

function validateMaterialForm() {

    if (!validateChapter()) return false;

    if (!validateMaterialType()) return false;

    if (!validateTitle()) return false;

    if (!validateFile()) return false;

    return true;

}



/* ==========================================================
   PREPARE MATERIAL OBJECT
========================================================== */

function buildMaterialObject() {

    let data = {

        chapterId: chapterSelect.value,

        type: materialType.value,

        title: getMaterialTitle(),

        fileURL: uploadedFileURL,

        publicId: uploadedPublicId,

        notes: "",

        quiz: [],

        status: "Active",

        updatedAt: serverTimestamp()

    };



    if (materialType.value === "Notes") {

        data.notes =

            editor ?

            editor.root.innerHTML :

            "";

    }



    if (materialType.value === "Quiz") {

        document

        .querySelectorAll(".quiz-question")

        .forEach(item => {

            data.quiz.push({

                question:

                item.querySelector(".question")?.value || "",

                option1:

                item.querySelector(".option1")?.value || "",

                option2:

                item.querySelector(".option2")?.value || "",

                option3:

                item.querySelector(".option3")?.value || "",

                option4:

                item.querySelector(".option4")?.value || "",

                answer:

                item.querySelector(".answer")?.value || ""

            });

        });

    }

    return data;

}



/* ==========================================================
   SAVE / UPDATE CONTROLLER
========================================================== */

async function processMaterialSave() {

    if (!validateMaterialForm()) {

        return;

    }

    setUploadButtonLoading(true);

    try {

        if (

            materialType.value === "PDF" ||

            materialType.value === "Video"

        ) {

            const upload =

                await uploadToCloudinary();

            if (!upload) {

                setUploadButtonLoading(false);

                return;

            }

        }



        const data = buildMaterialObject();



        if (currentMaterialId) {

            await updateMaterial(data);

        }

        else {

            data.createdAt = serverTimestamp();

            await addDoc(

                collection(db,"materials"),

                data

            );

            alert("Material Saved");

        }



        resetMaterialForm();

        resetFile();

        await loadMaterials();

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

    finally{

        setUploadButtonLoading(false);

    }

}



/* ==========================================================
   BUTTON EVENT
========================================================== */

saveMaterialBtn.onclick =

processMaterialSave;



/* ==========================================================
   PART 8 COMPLETE
========================================================== */

console.log("Materials.js Part 8 Loaded");
/* ==========================================================
   MATERIAL SEARCH
========================================================== */

function searchMaterials(keyword = "") {

    keyword = keyword.toLowerCase();

    const cards = document.querySelectorAll(".material-card");

    cards.forEach(card => {

        const title = card.querySelector("h4")
            .innerText
            .toLowerCase();

        const type = card.querySelector("p")
            .innerText
            .toLowerCase();

        if (
            title.includes(keyword) ||
            type.includes(keyword)
        ) {

            card.style.display = "flex";

        }

        else {

            card.style.display = "none";

        }

    });

}



/* ==========================================================
   MATERIAL COUNTER
========================================================== */

function updateMaterialCounter() {

    let counter = document.getElementById(
        "materialCounter"
    );

    if (!counter) {

        counter = document.createElement("div");

        counter.id = "materialCounter";

        counter.style.marginBottom = "20px";

        counter.style.fontWeight = "600";

        document
            .querySelector(".material-form")
            .prepend(counter);

    }

    counter.innerHTML =
        `Total Materials : ${materials.length}`;

}



/* ==========================================================
   MATERIAL PREVIEW
========================================================== */

function previewMaterial(id) {

    const material =

        materials.find(

            item => item.id === id

        );

    if (!material) return;

    console.table(material);

}



/* ==========================================================
   MATERIAL REFRESH
========================================================== */

async function refreshMaterials() {

    await loadMaterials();

    updateMaterialCounter();

}



/* ==========================================================
   MATERIAL SORT
========================================================== */

function sortMaterialsAZ() {

    materials.sort((a, b) =>

        a.title.localeCompare(b.title)

    );

    renderMaterials();

}



function sortMaterialsZA() {

    materials.sort((a, b) =>

        b.title.localeCompare(a.title)

    );

    renderMaterials();

}



/* ==========================================================
   AUTO REFRESH
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        refreshMaterials();

    }

);



/* ==========================================================
   PART 9 COMPLETE
========================================================== */

console.log(

    "Materials.js Part 9 Loaded"

);
/* ==========================================================
   FINAL INITIALIZATION
========================================================== */

function initializeMaterialManager() {

    console.log("========================================");
    console.log(" StudyWithOm Material Manager Loaded ");
    console.log(" Version : 1.0 Production ");
    console.log("========================================");

}



/* ==========================================================
   GLOBAL RESET
========================================================== */

function clearMaterialManager() {

    currentMaterialId = null;

    selectedFile = null;

    uploadedFileURL = "";

    uploadedPublicId = "";

    resetMaterialForm();

}



/* ==========================================================
   RELOAD
========================================================== */

async function reloadMaterialManager() {

    clearMaterialManager();

    await loadChapters();

    await loadMaterials();

}



/* ==========================================================
   WINDOW FUNCTIONS
========================================================== */

window.reloadMaterialManager =
reloadMaterialManager;

window.refreshMaterials =
refreshMaterials;

window.searchMaterials =
searchMaterials;

window.sortMaterialsAZ =
sortMaterialsAZ;

window.sortMaterialsZA =
sortMaterialsZA;

window.editMaterial =
editMaterial;

window.deleteMaterial =
deleteMaterial;



/* ==========================================================
   STARTUP
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    async () => {

        initializeMaterialManager();

        await loadChapters();

        await loadMaterials();

        updateMaterialCounter();

        hideAllMaterialSections();

    }

);



/* ==========================================================
   VERSION
========================================================== */

const MATERIAL_MANAGER_VERSION = "1.0.0";

console.log(

    "Material Manager Version :",

    MATERIAL_MANAGER_VERSION

);



/* ==========================================================
   FILE END
========================================================== */

console.log(

    "materials.js Loaded Successfully"

);