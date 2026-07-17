import { db } from "../firebase/firebase-config.js";

import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


// ===============================
// ELEMENTS
// ===============================

const classSelect = document.getElementById("classSelect");
const subjectSelect = document.getElementById("subjectSelect");
const chapterSelect = document.getElementById("chapterSelect");


// ===============================
// LOAD CLASSES
// ===============================

async function loadClasses() {

    classSelect.innerHTML =
    `<option value="">Choose Class</option>`;

    subjectSelect.innerHTML =
    `<option>Select Class First</option>`;

    chapterSelect.innerHTML =
    `<option>Select Subject First</option>`;

    subjectSelect.disabled = true;
    chapterSelect.disabled = true;

    try {

        // Find RBSE Board

        const boardQuery = query(

            collection(db, "nodes"),

            where("type", "==", "Board"),

            where("name", "==", "RBSE")

        );

        const boardSnap =
        await getDocs(boardQuery);


        if (boardSnap.empty) {

            alert("RBSE Board not found");

            return;

        }


        const boardId =
        boardSnap.docs[0].id;


        // Load Classes

        const classQuery = query(

            collection(db, "nodes"),

            where("type", "==", "Class"),

            where("parentId", "==", boardId)

        );


        const classSnap =
        await getDocs(classQuery);


        let classes = [];


        classSnap.forEach((doc)=>{

            classes.push({

                id:doc.id,

                ...doc.data()

            });

        });


        classes.sort((a,b)=>{

            return (a.order || 0) - (b.order || 0);

        });


        classes.forEach((item)=>{

            classSelect.innerHTML += `

            <option value="${item.id}">

                ${item.name}

            </option>

            `;

        });


        console.log(
            "Classes Loaded:",
            classes.length
        );

    }

    catch(error){

        console.error(
            error
        );

    }

}

loadClasses();


// ===============================
// LOAD SUBJECTS
// ===============================

classSelect.addEventListener(
"change",

async function(){

    subjectSelect.innerHTML =
    `<option value="">Choose Subject</option>`;

    chapterSelect.innerHTML =
    `<option>Select Subject First</option>`;

    chapterSelect.disabled = true;


    if(this.value===""){

        subjectSelect.disabled = true;

        return;

    }


    subjectSelect.disabled = false;


    const q = query(

        collection(db,"nodes"),

        where(
            "type",
            "==",
            "Subject"
        ),

        where(
            "parentId",
            "==",
            this.value
        )

    );


    const snap =
    await getDocs(q);


    let subjects = [];


    snap.forEach((doc)=>{

        subjects.push({

            id:doc.id,

            ...doc.data()

        });

    });


    subjects.sort((a,b)=>{

        return (a.order || 0) - (b.order || 0);

    });


    subjects.forEach((item)=>{

        subjectSelect.innerHTML += `

        <option value="${item.id}">

            ${item.name}

        </option>

        `;

    });


    console.log(
        "Subjects Loaded:",
        subjects.length
    );

});
// ===============================
// LOAD CHAPTERS
// ===============================

subjectSelect.addEventListener(
"change",

async function(){

    chapterSelect.innerHTML =
    `<option value="">Choose Chapter</option>`;


    if(this.value===""){

        chapterSelect.disabled = true;

        return;

    }


    chapterSelect.disabled = false;


    try{

        const q = query(

            collection(db,"nodes"),

            where(
                "type",
                "==",
                "Chapter"
            ),

            where(
                "parentId",
                "==",
                this.value
            )

        );


        const snap =
        await getDocs(q);


        let chapters = [];


        snap.forEach((doc)=>{

            chapters.push({

                id:doc.id,

                ...doc.data()

            });

        });


        chapters.sort((a,b)=>{

            return (a.order || 0) - (b.order || 0);

        });


        chapters.forEach((item)=>{

            chapterSelect.innerHTML += `

            <option value="${item.id}">

                ${item.name}

            </option>

            `;

        });


        console.log(
            "Chapters Loaded:",
            chapters.length
        );

    }

    catch(error){

        console.error(
            "Chapter Load Error:",
            error
        );

    }

});


// ===============================
// OPEN MATERIAL PAGE
// ===============================

chapterSelect.addEventListener(
"change",

function(){

    if(this.value===""){

        return;

    }


    window.location.href =

    `material.html?chapterId=${this.value}`;

});


// ===============================
// SEARCH (Coming Soon)
// ===============================

const searchInput =
document.getElementById("searchInput");

if(searchInput){

    searchInput.addEventListener(

        "input",

        function(){

            console.log(
                "Search:",
                this.value
            );

        }

    );

}


// ===============================
// READY
// ===============================

console.log(
    "RBSE Firebase System Ready ✅"
);