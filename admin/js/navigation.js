// ===========================================
// StudyWithOm CMS
// Navigation Module
// ===========================================

export function initNavigation() {

    console.log("Navigation Module Loaded");

    initializeSidebar();

    initializePages();

    initializeLocks();

}



// ===========================================
// ELEMENTS
// ===========================================

const sidebarItems = document.querySelectorAll(".sidebar li");

const dashboardPage = document.getElementById("dashboardPage");

const contentPage = document.getElementById("contentPage");

const materialsPage = document.getElementById("materialsPage");

const mediaPage = document.getElementById("mediaPage");

const settingsPage = document.getElementById("settingsPage");



// ===========================================
// PAGE LIST
// ===========================================

const pages = {

    Dashboard: dashboardPage,

    Content: contentPage,

    Materials: materialsPage,

    Media: mediaPage,

    Settings: settingsPage

};



// ===========================================
// SHOW PAGE
// ===========================================

function showPage(pageName){

    Object.values(pages).forEach(page=>{

        if(page){

            page.style.display="none";

        }

    });

    if(pages[pageName]){

        pages[pageName].style.display="block";

    }

}



// ===========================================
// ACTIVE SIDEBAR
// ===========================================

function activeItem(item){

    sidebarItems.forEach(li=>{

        li.classList.remove("active");

    });

    item.classList.add("active");

}
// ===========================================
// SIDEBAR EVENTS
// ===========================================

function initializeSidebar(){

    sidebarItems.forEach(item=>{

        item.addEventListener("click",()=>{

            const pageName=item.innerText.trim();

            activeItem(item);

            showPage(pageName);

        });

    });

}



// ===========================================
// INITIAL PAGE
// ===========================================

function initializePages(){

    showPage("Dashboard");

}



// ===========================================
// LOCK SYSTEM
// ===========================================

function initializeLocks(){

    checkMaterials();

    checkMedia();

}



// ===========================================
// MATERIAL LOCK
// ===========================================

function checkMaterials(){

    const materialBtn=

    sidebarItems[2];

    const contentReady=

    localStorage.getItem(

        "contentReady"

    );

    if(contentReady==="true"){

        materialBtn.classList.remove(

            "locked"

        );

    }

    else{

        materialBtn.classList.add(

            "locked"

        );

    }

}



// ===========================================
// MEDIA LOCK
// ===========================================

function checkMedia(){

    const mediaBtn=

    sidebarItems[3];

    const materialReady=

    localStorage.getItem(

        "materialReady"

    );

    if(materialReady==="true"){

        mediaBtn.classList.remove(

            "locked"

        );

    }

    else{

        mediaBtn.classList.add(

            "locked"

        );

    }

}



// ===========================================
// PUBLIC FUNCTIONS
// ===========================================

window.unlockMaterials=function(){

    localStorage.setItem(

        "contentReady",

        "true"

    );

    checkMaterials();

}



window.unlockMedia=function(){

    localStorage.setItem(

        "materialReady",

        "true"

    );

    checkMedia();

}



console.log("Navigation Ready");