/*==========================================================
 StudyWithOm CMS
 File : firebase.js
 Version : 1.0
==========================================================*/

/*==========================================================
 FIREBASE IMPORTS
==========================================================*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";



/*==========================================================
 FIREBASE CONFIG
==========================================================*/

const firebaseConfig = {

    apiKey: "AIzaSyDwlHpTGv1NP93DxTNbMx09Nnz3YIFEAm8",

    authDomain: "studywithom.firebaseapp.com",

    projectId:  "studywithom",

    storageBucket: "studywithom.firebasestorage.app",

    messagingSenderId: "745374680590",

    appId: "1:745374680590:web:cba7fe263951045f881e5f",

};



/*==========================================================
 INITIALIZE FIREBASE
==========================================================*/

const app = initializeApp(firebaseConfig);



/*==========================================================
 SERVICES
==========================================================*/

const db = getFirestore(app);

const auth = getAuth(app);



/*==========================================================
 CLOUDINARY CONFIG
==========================================================*/

const cloudinary = {

    cloudName: "abzhlo3h",

    uploadPreset: "studywithom"

};



/*==========================================================
 EXPORTS
==========================================================*/

export {

    app,

    db,

    auth,

    cloudinary

};