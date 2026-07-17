import { db, auth } from "../firebase/firebase-config.js";

import {
    collection,
    addDoc,
    serverTimestamp,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


// ===========================
// START
// ===========================

console.log("StudyWithOm CMS Started");
console.log(db);
console.log(auth);


// ===========================
// ELEMENTS
// ===========================

const form = document.getElementById("contentForm");

const parent = document.getElementById("parent");
const type = document.getElementById("type");
const nameInput = document.getElementById("name");
const order = document.getElementById("order");
const status = document.getElementById("status");

const tree = document.getElementById("tree");


// ===========================
// SAVE CONTENT
// ===========================

form.addEventListener("submit", async (e) => {

    e.preventDefault();


    if(nameInput.value.trim() === ""){

        alert("Please enter name");

        return;
    }


    const data = {

        name: nameInput.value.trim(),

        type: type.value,

        parentId: parent.value || null,

        order: Number(order.value) || 1,

        status: status.value === "Active",

        createdAt: serverTimestamp()

    };


    console.log("Saving...", data);


    try{

        const docRef = await addDoc(
            collection(db,"nodes"),
            data
        );


        console.log("Saved ID:",docRef.id);


        alert("Content Saved Successfully ✅");


        form.reset();


        loadParents();

        loadTree();


    }
    catch(error){

        console.error(
            "Save Error:",
            error
        );


        alert(error.message);

    }

});



// ===========================
// PARENT SYSTEM
// ===========================


const parentMap = {

    Category:null,

    Board:"Category",

    Class:"Board",

    Subject:"Class",

    Chapter:"Subject"

};



async function loadParents(){


    if(!parent) return;


    parent.innerHTML =
    `<option value="">None (Root Category)</option>`;


    const requiredType =
    parentMap[type.value];


    if(!requiredType){

        return;

    }



    try{


        const q = query(

            collection(db,"nodes"),

            where(
                "type",
                "==",
                requiredType
            )

        );



        const snapshot =
        await getDocs(q);



        console.log(
            "Parents Found:",
            snapshot.size
        );



        snapshot.forEach((doc)=>{


            const item =
            doc.data();



            parent.innerHTML += `

            <option value="${doc.id}">
                ${item.name}
            </option>

            `;


        });


    }
    catch(error){

        console.error(
            "Parent Load Error:",
            error
        );

    }


}



loadParents();


type.addEventListener(
    "change",
    loadParents
);




// ===========================
// CONTENT TREE
// ===========================


async function loadTree(){


    if(!tree) return;



    tree.innerHTML =
    "Loading...";



    try{


        const snapshot =
        await getDocs(
            collection(db,"nodes")
        );



        console.log(
            "Tree Documents:",
            snapshot.size
        );



        tree.innerHTML = "";



      let items = [];

snapshot.forEach((doc)=>{

    items.push({
        id: doc.id,
        ...doc.data()
    });

});


// Order के हिसाब से sort

items.sort((a,b)=>{

    return (a.order || 0) - (b.order || 0);

});



items.forEach((item)=>{


    let icon = "";


    if(item.type === "Category"){
        icon = "▣";
    }

    else if(item.type === "Board"){
        icon = "▤";
    }

    else if(item.type === "Class"){
        icon = "▦";
    }

    else if(item.type === "Subject"){
        icon = "■";
    }

    else if(item.type === "Chapter"){
        icon = "□";
    }



    tree.innerHTML += `

    <div class="tree-item">

        <span class="tree-icon">
            ${icon}
        </span>

        ${item.name}

        <small>(${item.type})</small>

    </div>

    `;


});



loadTree();