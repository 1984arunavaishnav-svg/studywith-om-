/*==========================================================
 StudyWithOm CMS
 File : admin.js
 Version : 1.0
==========================================================*/

import { initializeFirebase } from "./firebase.js";

import { initializeNavigation } from "./navigation.js";

import { initializeDashboard } from "./dashboard.js";

import { initializeContentManager } from "./content.js";

import { initializeTree } from "./tree.js";

import { initializeMaterials } from "./materials.js";

import { initializeUploader } from "./upload.js";

import { initializeMediaLibrary } from "./media.js";

import { initializeSettings } from "./settings.js";

import { showToast } from "./utils.js";

class StudyWithOmCMS {

    async start() {

        try {

            await initializeFirebase();

            initializeNavigation();

            initializeDashboard();

            initializeContentManager();

            initializeTree();

            initializeMaterials();

            initializeUploader();

            initializeMediaLibrary();

            initializeSettings();

            console.log("StudyWithOm CMS Started Successfully");

            showToast("CMS Loaded Successfully", "success");

        } catch (error) {

            console.error(error);

            showToast("CMS Failed To Load", "error");

        }

    }

}

document.addEventListener("DOMContentLoaded", () => {

    const app = new StudyWithOmCMS();

    app.start();

});