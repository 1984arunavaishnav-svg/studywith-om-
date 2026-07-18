/* ==========================================================
   StudyWithOm CMS
   File : upload.js
   Part : 1
   Module : Cloudinary Upload System
========================================================== */

import { db } from "./firebase.js";

import {
    doc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/* ==========================================================
   CLOUDINARY CONFIG
========================================================== */

const CLOUD_NAME = "abzhlo3h";

const UPLOAD_PRESET = "studywithom";

const RAW_UPLOAD_URL =
`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`;

const VIDEO_UPLOAD_URL =
`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`;

const IMAGE_UPLOAD_URL =
`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;


/* ==========================================================
   GLOBAL VARIABLES
========================================================== */

let uploadProgress = 0;

let uploadResponse = null;

let currentXHR = null;

let isUploading = false;


/* ==========================================================
   DOM ELEMENTS
========================================================== */

const saveMaterialBtn =
document.getElementById("saveMaterial");

const progressContainer =
document.getElementById("uploadProgress");

const progressBar =
document.getElementById("progressBar");

const progressText =
document.getElementById("progressText");


/* ==========================================================
   RESET
========================================================== */

export function resetUploadSystem(){

    uploadProgress = 0;

    uploadResponse = null;

    currentXHR = null;

    isUploading = false;

    updateProgress(0);

}


/* ==========================================================
   UPDATE PROGRESS
========================================================== */

function updateProgress(percent){

    if(progressBar){

        progressBar.style.width = percent + "%";

    }

    if(progressText){

        progressText.innerHTML = percent + "%";

    }

}


/* ==========================================================
   SHOW / HIDE
========================================================== */

function showProgress(){

    if(progressContainer){

        progressContainer.style.display="block";

    }

}

function hideProgress(){

    if(progressContainer){

        progressContainer.style.display="none";

    }

}


/* ==========================================================
   BUTTON STATE
========================================================== */

export function setUploadLoading(status){

    isUploading=status;

    if(status){

        saveMaterialBtn.disabled=true;

        saveMaterialBtn.innerHTML=
        '<i class="fa-solid fa-spinner fa-spin"></i> Uploading...';

    }

    else{

        saveMaterialBtn.disabled=false;

        saveMaterialBtn.innerHTML=
        '<i class="fa-solid fa-floppy-disk"></i> Save Material';

    }

}


/* ==========================================================
   PART 1 COMPLETE
========================================================== */

console.log("upload.js Part 1 Loaded");
/* ==========================================================
   CLOUDINARY UPLOAD FUNCTION
========================================================== */

export async function uploadFile(file, type = "raw") {

    return new Promise((resolve, reject) => {

        if (!file) {

            reject("No File Selected");

            return;

        }

        showProgress();

        setUploadLoading(true);

        const formData = new FormData();

        formData.append("file", file);

        formData.append("upload_preset", UPLOAD_PRESET);

        let uploadURL = RAW_UPLOAD_URL;

        if (type === "video") {

            uploadURL = VIDEO_UPLOAD_URL;

        }

        if (type === "image") {

            uploadURL = IMAGE_UPLOAD_URL;

        }

        currentXHR = new XMLHttpRequest();

        currentXHR.open("POST", uploadURL);

        currentXHR.upload.addEventListener("progress", (e) => {

            if (e.lengthComputable) {

                uploadProgress = Math.round(

                    (e.loaded / e.total) * 100

                );

                updateProgress(uploadProgress);

            }

        });

        currentXHR.onload = () => {

            setUploadLoading(false);

            hideProgress();

            if (

                currentXHR.status >= 200 &&

                currentXHR.status < 300

            ) {

                uploadResponse = JSON.parse(

                    currentXHR.responseText

                );

                resolve(uploadResponse);

            }

            else {

                reject(

                    currentXHR.responseText

                );

            }

        };

        currentXHR.onerror = () => {

            setUploadLoading(false);

            hideProgress();

            reject("Upload Failed");

        };

        currentXHR.send(formData);

    });

}



/* ==========================================================
   PDF UPLOAD
========================================================== */

export async function uploadPDF(file){

    return await uploadFile(

        file,

        "raw"

    );

}



/* ==========================================================
   VIDEO UPLOAD
========================================================== */

export async function uploadVideo(file){

    return await uploadFile(

        file,

        "video"

    );

}



/* ==========================================================
   IMAGE UPLOAD
========================================================== */

export async function uploadImage(file){

    return await uploadFile(

        file,

        "image"

    );

}



/* ==========================================================
   PART 2 COMPLETE
========================================================== */

console.log("upload.js Part 2 Loaded");
/* ==========================================================
   FILE VALIDATION
========================================================== */

const MAX_PDF_SIZE = 100 * 1024 * 1024;
const MAX_VIDEO_SIZE = 500 * 1024 * 1024;
const MAX_IMAGE_SIZE = 20 * 1024 * 1024;

export function validateUploadFile(file, type) {

    if (!file) {

        alert("Please Select File");

        return false;

    }

    switch (type) {

        case "raw":

            if (file.size > MAX_PDF_SIZE) {

                alert("PDF must be below 100 MB");

                return false;

            }

            if (

                file.type !== "application/pdf"

            ) {

                alert("Only PDF Allowed");

                return false;

            }

            break;

        case "video":

            if (

                file.size > MAX_VIDEO_SIZE

            ) {

                alert("Video must be below 500 MB");

                return false;

            }

            if (

                !file.type.startsWith("video/")

            ) {

                alert("Only Video Allowed");

                return false;

            }

            break;

        case "image":

            if (

                file.size > MAX_IMAGE_SIZE

            ) {

                alert("Image must be below 20 MB");

                return false;

            }

            if (

                !file.type.startsWith("image/")

            ) {

                alert("Only Images Allowed");

                return false;

            }

            break;

    }

    return true;

}



/* ==========================================================
   CANCEL UPLOAD
========================================================== */

export function cancelUpload() {

    if (

        currentXHR &&

        isUploading

    ) {

        currentXHR.abort();

        hideProgress();

        setUploadLoading(false);

        alert("Upload Cancelled");

    }

}



/* ==========================================================
   RETRY UPLOAD
========================================================== */

export async function retryUpload(

    file,

    type

) {

    try {

        resetUploadSystem();

        return await uploadFile(

            file,

            type

        );

    }

    catch (error) {

        console.error(error);

        throw error;

    }

}



/* ==========================================================
   GET LAST RESPONSE
========================================================== */

export function getUploadResponse() {

    return uploadResponse;

}



/* ==========================================================
   GET FILE URL
========================================================== */

export function getUploadedURL() {

    if (

        uploadResponse

    ) {

        return uploadResponse.secure_url;

    }

    return "";

}



/* ==========================================================
   GET PUBLIC ID
========================================================== */

export function getPublicId() {

    if (

        uploadResponse

    ) {

        return uploadResponse.public_id;

    }

    return "";

}



/* ==========================================================
   PART 3 COMPLETE
========================================================== */

console.log(

    "upload.js Part 3 Loaded"

);
/* ==========================================================
   UPLOAD PREVIEW
========================================================== */

export function createUploadPreview(result) {

    if (!result) return;

    const previewBox = document.getElementById("uploadPreview");

    if (!previewBox) return;

    previewBox.innerHTML = "";

    let html = "";

    if (result.resource_type === "image") {

        html = `
            <img
                src="${result.secure_url}"
                style="
                    width:220px;
                    border-radius:10px;
                    margin-top:10px;
                ">
        `;

    }

    else if (result.resource_type === "video") {

        html = `
            <video
                controls
                width="280"
                style="margin-top:10px;border-radius:10px;">

                <source
                    src="${result.secure_url}">

            </video>
        `;

    }

    else {

        html = `
            <div class="pdfPreview">

                <i class="fa-solid fa-file-pdf"></i>

                <a
                    href="${result.secure_url}"
                    target="_blank">

                    Open Uploaded PDF

                </a>

            </div>
        `;

    }

    previewBox.innerHTML = html;

}



/* ==========================================================
   FILE INFORMATION
========================================================== */

export function getFileInformation(result){

    if(!result) return null;

    return{

        url:result.secure_url,

        publicId:result.public_id,

        resourceType:result.resource_type,

        format:result.format,

        bytes:result.bytes,

        originalName:result.original_filename,

        createdAt:result.created_at

    };

}



/* ==========================================================
   CLEAR PREVIEW
========================================================== */

export function clearUploadPreview(){

    const previewBox=

    document.getElementById(

        "uploadPreview"

    );

    if(previewBox){

        previewBox.innerHTML="";

    }

}



/* ==========================================================
   UPLOAD STATUS
========================================================== */

export function getUploadStatus(){

    return{

        uploading:isUploading,

        progress:uploadProgress,

        response:uploadResponse

    };

}



/* ==========================================================
   PART 4 COMPLETE
========================================================== */

console.log("upload.js Part 4 Loaded");