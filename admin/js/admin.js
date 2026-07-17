// ===================================
// StudyWithOm CMS
// Main Controller
// ===================================

import "./firebase.js";

import { initContent } from "./content.js";
import { initTree } from "./tree.js";
import { initMaterials } from "./materials.js";
import { initUpload } from "./upload.js";
import { initNotes } from "./notes.js";
import { initQuiz } from "./quiz.js";

window.addEventListener("DOMContentLoaded", () => {

    console.log("=================================");
    console.log("StudyWithOm CMS Started");
    console.log("=================================");

    initContent();

    initTree();

    initMaterials();

    initUpload();

    initNotes();

    initQuiz();

});