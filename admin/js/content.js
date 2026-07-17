// ===========================================
// StudyWithOm CMS
// Content Module
// ===========================================

import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    serverTimestamp,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";



// ===========================================
// EXPORT
// ===========================================

export function initContent(){

    console.log("Content Module Loaded");

    initializeElements();

    bindEvents();

    loadParents();

}



// ===========================================
// ELEMENTS
// ===========================================

let form;

let parent;

let type;

let name;

let order;

let status;

let saveButton;



// ===========================================
// INITIALIZE ELEMENTS
// ===========================================

function initializeElements(){

    form =

    document.getElementById("contentForm");

    parent =

    document.getElementById("parent");

    type =

    document.getElementById("type");

    name =

    document.getElementById("name");

    order =

    document.getElementById("order");

    status =

    document.getElementById("status");

    saveButton =

    document.getElementById("saveBtn");

}



// ===========================================
// EVENTS
// ===========================================

function bindEvents(){

    if(type){

        type.addEventListener(

            "change",

            loadParents

        );

    }

    if(form){

        form.addEventListener(

            "submit",

            saveContent

        );

    }

}



// ===========================================
// PARENT MAP
// ===========================================

const parentMap={

    Category:null,

    Board:"Category",

    Class:"Board",

    Subject:"Class",

    Chapter:"Subject"

};



// ===========================================
// LOAD PARENTS
// ===========================================

async function loadParents(){

    parent.innerHTML=

    `<option value="">

        None (Root)

    </option>`;

    const parentType=

    parentMap[type.value];

    if(!parentType){

        return;

    }

    try{

        const q=

        query(

            collection(db,"nodes"),

            where(

                "type",

                "==",

                parentType

            )

        );

        const snap=

        await getDocs(q);

        snap.forEach(doc=>{

            const data=

            doc.data();

            parent.innerHTML+=`

                <option value="${doc.id}">

                    ${data.name}

                </option>

            `;

        });

    }

    catch(error){

        console.error(error);

    }

}
// ===========================================
// SAVE CONTENT
// ===========================================

async function saveContent(event){

    event.preventDefault();

    // -----------------------
    // Validation
    // -----------------------

    if(name.value.trim()===""){

        alert("Please Enter Name");

        name.focus();

        return;

    }

    // -----------------------
    // Disable Button
    // -----------------------

    saveButton.disabled=true;

    saveButton.innerHTML="Saving...";

    // -----------------------
    // Create Object
    // -----------------------

    const contentData={

        name:name.value.trim(),

        type:type.value,

        parentId:parent.value || null,

        order:Number(order.value)||1,

        status:status.value==="Active",

        createdAt:serverTimestamp()

    };

    console.log(contentData);

    // -----------------------
    // Save Firestore
    // -----------------------

    try{

        await addDoc(

            collection(db,"nodes"),

            contentData

        );

        console.log("Content Saved");

        alert("Content Saved Successfully");

        // -----------------------
        // Reset Form
        // -----------------------

        form.reset();

        order.value=1;

        parent.innerHTML=`
        <option value="">
        None (Root)
        </option>
        `;

        // -----------------------
        // Reload Parent
        // -----------------------

        loadParents();

        // -----------------------
        // Reload Tree
        // -----------------------

        if(window.loadTree){

            window.loadTree();

        }

        // -----------------------
        // Unlock Materials
        // -----------------------

        if(contentData.type==="Chapter"){

            localStorage.setItem(

                "contentReady",

                "true"

            );

            if(window.unlockMaterials){

                window.unlockMaterials();

            }

        }

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

    finally{

        saveButton.disabled=false;

        saveButton.innerHTML=`
        <i class="fa-solid fa-plus"></i>
        Save Content
        `;

    }

}



// ===========================================
// CHECK CONTENT STATUS
// ===========================================

window.checkContentStatus=function(){

    const ready=

    localStorage.getItem(

        "contentReady"

    );

    console.log(

        "Content Ready :",

        ready

    );

};



// ===========================================
// REFRESH CONTENT
// ===========================================

window.refreshContent=function(){

    loadParents();

    if(window.loadTree){

        window.loadTree();

    }

};



// ===========================================
// PART-2 COMPLETE
// ===========================================

console.log("Content.js Part-2 Loaded");
// ===========================================
// DUPLICATE CONTENT CHECK
// ===========================================

async function isDuplicateContent() {

    try {

        const q = query(

            collection(db, "nodes"),

            where("name", "==", name.value.trim()),

            where("type", "==", type.value)

        );

        const snap = await getDocs(q);

        return !snap.empty;

    }

    catch (error) {

        console.error("Duplicate Check Error", error);

        return false;

    }

}



// ===========================================
// AUTO ORDER
// ===========================================

async function autoOrder() {

    try {

        const q = query(

            collection(db, "nodes"),

            where("parentId", "==", (parent.value || null))

        );

        const snap = await getDocs(q);

        order.value = snap.size + 1;

    }

    catch (error) {

        console.error(error);

    }

}



// ===========================================
// TYPE CHANGE
// ===========================================

type.addEventListener("change", async () => {

    await loadParents();

    await autoOrder();

});



// ===========================================
// PARENT CHANGE
// ===========================================

parent.addEventListener("change", async () => {

    await autoOrder();

});



// ===========================================
// FORM VALIDATION
// ===========================================

function validateContent() {

    if (name.value.trim() === "") {

        alert("Please Enter Name");

        return false;

    }

    if (type.value === "") {

        alert("Please Select Type");

        return false;

    }

    return true;

}



// ===========================================
// CLEAR FORM
// ===========================================

function clearContentForm() {

    form.reset();

    order.value = 1;

    parent.innerHTML = `

        <option value="">

            None (Root)

        </option>

    `;

}



// ===========================================
// REFRESH TREE
// ===========================================

function refreshTree() {

    if (window.loadTree) {

        window.loadTree();

    }

}



// ===========================================
// CONTENT STATISTICS
// ===========================================

window.contentStats = async function () {

    const snap = await getDocs(

        collection(db, "nodes")

    );

    console.log("Total Contents :", snap.size);

};



// ===========================================
// PART 3 LOADED
// ===========================================

console.log("Content.js Part-3 Loaded");
// ===========================================
// EDIT CONTENT
// ===========================================

window.editNode = async function (id) {

    try {

        const newName = prompt("Enter New Name");

        if (!newName || newName.trim() === "") {

            return;

        }

        await updateDoc(

            doc(db, "nodes", id),

            {

                name: newName.trim()

            }

        );

        alert("Content Updated Successfully");

        refreshTree();

        loadParents();

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

};



// ===========================================
// DELETE CONTENT
// ===========================================

window.deleteNode = async function (id) {

    try {

        // Check Child

        const q = query(

            collection(db, "nodes"),

            where("parentId", "==", id)

        );

        const childSnap = await getDocs(q);

        if (!childSnap.empty) {

            alert(

                "Delete Child Items First"

            );

            return;

        }

        if (!confirm(

            "Delete this Content ?"

        )) {

            return;

        }

        await deleteDoc(

            doc(db, "nodes", id)

        );

        alert(

            "Deleted Successfully"

        );

        refreshTree();

        loadParents();

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

};



// ===========================================
// COUNT CONTENT
// ===========================================

window.totalContent = async function () {

    try {

        const snap = await getDocs(

            collection(db, "nodes")

        );

        return snap.size;

    }

    catch (error) {

        console.error(error);

        return 0;

    }

};



// ===========================================
// LAST CONTENT
// ===========================================

window.lastContent = async function () {

    try {

        const snap = await getDocs(

            collection(db, "nodes")

        );

        let last = "";

        snap.forEach(doc => {

            last = doc.data().name;

        });

        console.log("Last :", last);

    }

    catch (error) {

        console.error(error);

    }

};



// ===========================================
// REFRESH ALL
// ===========================================

window.refreshAllContent = function () {

    loadParents();

    refreshTree();

};



// ===========================================
// PART 4 LOADED
// ===========================================

console.log("Content.js Part-4 Loaded");
// ===========================================
// MATERIAL UNLOCK SYSTEM
// ===========================================

async function checkChapterAvailable() {

    try {

        const q = query(

            collection(db, "nodes"),

            where("type", "==", "Chapter")

        );

        const snap = await getDocs(q);

        if (!snap.empty) {

            localStorage.setItem(
                "contentReady",
                "true"
            );

            if (window.unlockMaterials) {

                window.unlockMaterials();

            }

            console.log(
                "Materials Unlocked"
            );

        }

    }

    catch (error) {

        console.error(error);

    }

}



// ===========================================
// CONTENT COUNTER
// ===========================================

async function updateContentCounter() {

    try {

        const snap = await getDocs(

            collection(db, "nodes")

        );

        const counter = document.getElementById(

            "contentCount"

        );

        if (counter) {

            counter.innerHTML = snap.size;

        }

    }

    catch (error) {

        console.error(error);

    }

}



// ===========================================
// DASHBOARD REFRESH
// ===========================================

window.refreshDashboard = function () {

    updateContentCounter();

    checkChapterAvailable();

};



// ===========================================
// AFTER SAVE
// ===========================================

window.afterContentSaved = async function () {

    await loadParents();

    refreshTree();

    updateContentCounter();

    checkChapterAvailable();

};



// ===========================================
// AUTO LOAD
// ===========================================

window.addEventListener(

    "DOMContentLoaded",

    () => {

        updateContentCounter();

        checkChapterAvailable();

    }

);



// ===========================================
// CONTENT SEARCH
// ===========================================

window.searchContent = function (keyword) {

    keyword = keyword.toLowerCase();

    const items =

    document.querySelectorAll(".tree-item");

    items.forEach(item => {

        if (

            item.innerText

            .toLowerCase()

            .includes(keyword)

        ) {

            item.style.display = "flex";

        }

        else {

            item.style.display = "none";

        }

    });

};



// ===========================================
// CONTENT EXPORT
// ===========================================

window.exportContent = async function () {

    try {

        const snap = await getDocs(

            collection(db, "nodes")

        );

        const data = [];

        snap.forEach(doc => {

            data.push({

                id: doc.id,

                ...doc.data()

            });

        });

        console.log(data);

    }

    catch (error) {

        console.error(error);

    }

};



// ===========================================
// PART 5 LOADED
// ===========================================

console.log("Content.js Part-5 Loaded");
// ===========================================
// FINAL INITIALIZATION
// ===========================================

async function initializeContentModule() {

    try {

        console.log("Initializing Content Module...");

        await loadParents();

        await checkChapterAvailable();

        await updateContentCounter();

        if (window.loadTree) {

            await window.loadTree();

        }

        console.log("Content Module Ready");

    }

    catch (error) {

        console.error("Initialization Error :", error);

    }

}



// ===========================================
// AUTO REFRESH
// ===========================================

window.reloadContentModule = async function () {

    await initializeContentModule();

};



// ===========================================
// RESET FORM
// ===========================================

window.resetContentForm = function () {

    if (form) {

        form.reset();

    }

    if (order) {

        order.value = 1;

    }

    loadParents();

};



// ===========================================
// CONTENT HEALTH CHECK
// ===========================================

window.contentHealth = async function () {

    try {

        const snap = await getDocs(

            collection(db, "nodes")

        );

        console.table({

            "Total Nodes": snap.size,

            "Material Unlock":

                localStorage.getItem("contentReady"),

            "Module": "Working"

        });

    }

    catch (error) {

        console.error(error);

    }

};



// ===========================================
// MODULE READY
// ===========================================

initializeContentModule();

console.log("====================================");
console.log("StudyWithOm Content Module Ready");
console.log("====================================");



// ===========================================
// EXPORT PUBLIC FUNCTIONS
// ===========================================

export {

    loadParents,

    refreshTree,

    updateContentCounter,

    checkChapterAvailable

};