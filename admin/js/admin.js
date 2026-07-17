// ===========================================
// StudyWithOm CMS
// Main Controller
// Version : 1.0
// ===========================================


// ===========================================
// IMPORT FIREBASE
// ===========================================

import "./firebase.js";


// ===========================================
// IMPORT MODULES
// ===========================================

import { initNavigation } from "./navigation.js";

import { initContent } from "./content.js";

import { initTree } from "./tree.js";

import { initMaterials } from "./materials.js";

import { initUpload } from "./upload.js";

import { initNotes } from "./notes.js";

import { initQuiz } from "./quiz.js";

import { initMedia } from "./media.js";

import { initSettings } from "./settings.js";


// ===========================================
// CMS INFORMATION
// ===========================================

const CMS = {

    name : "StudyWithOm CMS",

    version : "1.0",

    developer : "StudyWithOm",

    status : "Production"

};


// ===========================================
// GLOBAL ELEMENTS
// ===========================================

const body =
document.body;

const sidebar =
document.querySelector(".sidebar");

const pages =
document.querySelectorAll(".page");

const loader =
document.getElementById("loader");


// ===========================================
// APPLICATION START
// ===========================================

window.addEventListener(

    "DOMContentLoaded",

    async function(){

        console.clear();

        console.log("================================");

        console.log(CMS.name);

        console.log("Version :",CMS.version);

        console.log("Developer :",CMS.developer);

        console.log("Status :",CMS.status);

        console.log("================================");

        try{

            await initializeCMS();

        }

        catch(error){

            console.error(

                "CMS Start Error",

                error

            );

        }

    }

);


// ===========================================
// INITIALIZE CMS
// ===========================================

async function initializeCMS(){

    showLoader();

    loadModules();

    hideLoader();

    console.log(

        "CMS Loaded Successfully"

    );

}


// ===========================================
// LOAD ALL MODULES
// ===========================================

function loadModules(){

    console.log("Loading Navigation...");

    initNavigation();


    console.log("Loading Content...");

    initContent();


    console.log("Loading Tree...");

    initTree();


    console.log("Loading Materials...");

    initMaterials();


    console.log("Loading Upload...");

    initUpload();


    console.log("Loading Notes...");

    initNotes();


    console.log("Loading Quiz...");

    initQuiz();


    console.log("Loading Media...");

    initMedia();


    console.log("Loading Settings...");

    initSettings();

}


// ===========================================
// GLOBAL LOADER
// ===========================================

window.showLoader = function(){

    if(loader){

        loader.style.display = "flex";

    }

}


window.hideLoader = function(){

    if(loader){

        loader.style.display = "none";

    }

}


// ===========================================
// PAGE CONTROLLER
// ===========================================

window.openPage = function(pageID){

    pages.forEach(function(page){

        page.style.display = "none";

    });

    const currentPage =

    document.getElementById(pageID);

    if(currentPage){

        currentPage.style.display = "block";

    }

}


// ===========================================
// SIDEBAR ACTIVE BUTTON
// ===========================================

window.activeMenu = function(menu){

    const menus =

    document.querySelectorAll(

        ".sidebar li"

    );

    menus.forEach(function(item){

        item.classList.remove(

            "active"

        );

    });

    menu.classList.add(

        "active"

    );

}


// ===========================================
// GLOBAL ALERT
// ===========================================

window.successMessage = function(message){

    alert("✅ " + message);

}


window.errorMessage = function(message){

    alert("❌ " + message);

}


// ===========================================
// GLOBAL CONFIRM
// ===========================================

window.confirmDelete = function(){

    return confirm(

        "Are you sure?"

    );

}
// ===========================================
// EVENT MANAGER
// ===========================================

function registerGlobalEvents(){

    console.log("Registering Global Events...");

    window.addEventListener("online", () => {

        console.log("Internet Connected");

    });

    window.addEventListener("offline", () => {

        console.log("Internet Disconnected");

    });

    document.addEventListener("keydown",(event)=>{

        // Ctrl + S Block

        if(event.ctrlKey && event.key==="s"){

            event.preventDefault();

            console.log("Save Shortcut Disabled");

        }

    });

}



// ===========================================
// DASHBOARD
// ===========================================

function initializeDashboard(){

    console.log("Dashboard Loaded");

    updateDashboard();

}



// ===========================================
// UPDATE DASHBOARD
// ===========================================

window.updateDashboard = function(){

    const totalCards =

    document.querySelectorAll(".dashboard-card");

    console.log(

        "Dashboard Cards :",

        totalCards.length

    );

}



// ===========================================
// AUTO REFRESH
// ===========================================

let autoRefresh = true;

window.startAutoRefresh = function(){

    if(!autoRefresh) return;

    setInterval(()=>{

        console.log("Refreshing CMS...");

    },60000);

}



// ===========================================
// STORAGE
// ===========================================

window.saveLocal = function(key,value){

    localStorage.setItem(

        key,

        JSON.stringify(value)

    );

}


window.getLocal = function(key){

    const data =

    localStorage.getItem(key);

    if(!data){

        return null;

    }

    return JSON.parse(data);

}



// ===========================================
// SESSION
// ===========================================

window.clearSession = function(){

    sessionStorage.clear();

    console.log("Session Cleared");

}



// ===========================================
// MODULE STATUS
// ===========================================

window.moduleStatus = {

    navigation:false,

    content:false,

    tree:false,

    materials:false,

    upload:false,

    notes:false,

    quiz:false,

    media:false,

    settings:false

};



// ===========================================
// MODULE LOADED
// ===========================================

window.moduleLoaded = function(name){

    if(window.moduleStatus[name]!==undefined){

        window.moduleStatus[name]=true;

    }

    console.log(

        name,

        "Module Ready"

    );

}



// ===========================================
// CHECK MODULES
// ===========================================

window.checkModules=function(){

    console.table(

        window.moduleStatus

    );

}



// ===========================================
// FIREBASE STATUS
// ===========================================

window.firebaseReady=function(){

    console.log(

        "Firebase Connected"

    );

}



// ===========================================
// LOADER START
// ===========================================

registerGlobalEvents();

initializeDashboard();

startAutoRefresh();

console.log("Admin.js Part-2 Loaded");

// ===========================================
// SIDEBAR NAVIGATION
// ===========================================

function initializeSidebar() {

    const menuItems = document.querySelectorAll(".sidebar li");

    const pages = {

        Dashboard: "dashboardPage",

        Content: "contentPage",

        Materials: "materialsPage",

        Media: "mediaPage",

        Settings: "settingsPage"

    };

    menuItems.forEach((item) => {

        item.addEventListener("click", () => {

            menuItems.forEach((li) => {

                li.classList.remove("active");

            });

            item.classList.add("active");

            const text = item.innerText.trim();

            const page = pages[text];

            if (page) {

                openPage(page);

            }

        });

    });

}



// ===========================================
// PAGE TRANSITION
// ===========================================

window.openPage = function(pageID){

    const allPages =

    document.querySelectorAll(".page");

    allPages.forEach(page=>{

        page.style.display="none";

    });

    const page =

    document.getElementById(pageID);

    if(page){

        page.style.display="block";

    }

}



// ===========================================
// NOTIFICATION
// ===========================================

window.notify=function(message,type="success"){

    console.log(

        "["+type.toUpperCase()+"]",

        message

    );

}



// ===========================================
// SEARCH
// ===========================================

window.searchTree=function(keyword){

    keyword=keyword.toLowerCase();

    const items=

    document.querySelectorAll(".tree-item");

    items.forEach(item=>{

        if(item.innerText.toLowerCase().includes(keyword)){

            item.style.display="flex";

        }

        else{

            item.style.display="none";

        }

    });

}



// ===========================================
// THEME
// ===========================================

window.changeTheme=function(mode){

    if(mode==="dark"){

        document.body.classList.add(

            "dark"

        );

    }

    else{

        document.body.classList.remove(

            "dark"

        );

    }

}



// ===========================================
// PERFORMANCE
// ===========================================

window.performanceInfo=function(){

    console.table({

        Memory:

        performance.memory ?

        performance.memory.usedJSHeapSize :

        "Not Supported",

        Time:

        performance.now()

    });

}



// ===========================================
// ERROR LOGGER
// ===========================================

window.onerror=function(

message,

source,

line,

column,

error

){

    console.error(

        "Global Error",

        {

            message,

            source,

            line,

            column,

            error

        }

    );

}



// ===========================================
// UTILITIES
// ===========================================

window.randomID=function(){

    return Math.random()

    .toString(36)

    .substring(2,10);

}



window.formatDate=function(){

    const date=

    new Date();

    return date.toLocaleString();

}



// ===========================================
// SYSTEM INFO
// ===========================================

window.systemInfo=function(){

    console.table({

        App:CMS.name,

        Version:CMS.version,

        Browser:navigator.userAgent,

        Language:navigator.language,

        Online:navigator.onLine

    });

}



// ===========================================
// INITIALIZE
// ===========================================

initializeSidebar();

console.log("Sidebar Ready");

console.log("Search Ready");

console.log("Notification Ready");

console.log("Theme Ready");

console.log("Performance Ready");

console.log("Admin.js Part-3 Loaded");

// ===========================================
// CMS BOOT MANAGER
// ===========================================

function bootCMS() {

    console.log("====================================");
    console.log("StudyWithOm CMS Boot Completed");
    console.log("====================================");

    firebaseReady();

    checkModules();

    systemInfo();

}



// ===========================================
// KEYBOARD SHORTCUTS
// ===========================================

document.addEventListener("keydown", function(e){

    // Ctrl + D
    if(e.ctrlKey && e.key==="d"){

        e.preventDefault();

        openPage("dashboardPage");

    }

    // Ctrl + M
    if(e.ctrlKey && e.key==="m"){

        e.preventDefault();

        openPage("materialsPage");

    }

    // Ctrl + C
    if(e.ctrlKey && e.key==="c"){

        e.preventDefault();

        openPage("contentPage");

    }

});



// ===========================================
// AUTO SAVE
// ===========================================

window.autoSave=function(){

    console.log("Auto Save Enabled");

}



// ===========================================
// AUTO BACKUP
// ===========================================

window.autoBackup=function(){

    console.log("Cloud Backup Ready");

}



// ===========================================
// DEBUG MODE
// ===========================================

window.debug=function(){

    console.table({

        Modules:window.moduleStatus,

        Online:navigator.onLine,

        Time:new Date().toLocaleString()

    });

}



// ===========================================
// LOGOUT
// ===========================================

window.logout=function(){

    if(confirm("Logout ?")){

        location.reload();

    }

}



// ===========================================
// RESET CMS
// ===========================================

window.resetCMS=function(){

    if(confirm("Reset CMS Cache ?")){

        localStorage.clear();

        sessionStorage.clear();

        location.reload();

    }

}



// ===========================================
// HEALTH CHECK
// ===========================================

window.health=function(){

    console.log("========== HEALTH ==========");

    console.table(window.moduleStatus);

    console.log("Online :",navigator.onLine);

    console.log("============================");

}



// ===========================================
// STARTUP
// ===========================================

bootCMS();

autoSave();

autoBackup();

console.log("Admin.js Ready");

console.log("StudyWithOm CMS Successfully Loaded");
