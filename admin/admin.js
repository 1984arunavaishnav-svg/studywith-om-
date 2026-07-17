import { db, auth } from "../firebase/firebase-config.js";

import {
    collection,
    addDoc,
    serverTimestamp,
    getDocs,
    query,
    where,
    updateDoc,
    deleteDoc,
    doc
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
// MATERIAL ELEMENTS
// ===========================

const materialForm =
document.getElementById("materialForm");


const chapterSelect =
document.getElementById("chapterSelect");


const materialType =
document.getElementById("materialType");


const materialTitle =
document.getElementById("materialTitle");


const materialURL =
document.getElementById("materialURL");



// ===========================
// SAVE CONTENT
// ===========================

form.addEventListener("submit", async function(e){

    e.preventDefault();


    if(nameInput.value.trim() === ""){

        alert("Enter name");

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


        console.log(
            "Saved ID:",
            docRef.id
        );


        alert(
            "Content Saved Successfully"
        );


        form.reset();


        loadParents();

        loadTree();


    }
    catch(error){

        console.error(
            error
        );


        alert(
            error.message
        );

    }


});




// ===========================
// PARENT DROPDOWN
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
    '<option value="">None (Root Category)</option>';



    const need =
    parentMap[type.value];



    if(!need){

        return;

    }



    try{


        const q = query(

            collection(db,"nodes"),

            where(
                "type",
                "==",
                need
            )

        );



        const snap =
        await getDocs(q);



        console.log(
            "Parents Found:",
            snap.size
        );



        snap.forEach(function(doc){


            const item = doc.data();



            parent.innerHTML +=

            `
            <option value="${doc.id}">
                ${item.name}
            </option>
            `;


        });



    }
    catch(error){

        console.error(
            "Parent Error",
            error
        );

    }


}



type.addEventListener(
    "change",
    loadParents
);



loadParents();




// ===========================
// CONTENT TREE
// ===========================


async function loadTree(){


    if(!tree) return;



    tree.innerHTML =
    "Loading...";



    try{


        const snap =
        await getDocs(
            collection(db,"nodes")
        );



        let nodes = [];



        snap.forEach(function(doc){


            nodes.push({

                id:doc.id,

                ...doc.data()

            });


        });



        console.log(
            "Tree Documents:",
            nodes.length
        );



        function makeTree(parentId, level){


            let html = "";



            nodes

            .filter(function(node){

                return node.parentId === parentId;

            })

            .sort(function(a,b){

                return (a.order || 0) - (b.order || 0);

            })

            .forEach(function(node){



                let icon = "□";



                if(node.type === "Category")
                    icon = "▣";


                if(node.type === "Board")
                    icon = "▤";


                if(node.type === "Class")
                    icon = "▦";


                if(node.type === "Subject")
                    icon = "■";



                html += `

                <div class="tree-item"
                style="margin-left:${level * 25}px">

                    <span class="tree-icon">
                    ${icon}
                    </span>

                    ${node.name}

                    (${node.type})

                    <div class="tree-actions">

                    <button onclick="editNode('${node.id}')">
                    Edit
                    </button>

                    <button onclick="deleteNode('${node.id}')">
                    Delete
                    </button>

                    </div>


                 

                </div>

                `;



                html += makeTree(
                    node.id,
                    level + 1
                );


            });



            return html;


        }



        tree.innerHTML =
        makeTree(null,0);



    }
    catch(error){


        console.error(
            "Tree Error:",
            error
        );


        tree.innerHTML =
        "Tree Load Error";


    }


}



loadTree();
// ===========================
// DELETE NODE
// ===========================

// ===========================
// SAFE DELETE NODE
// ===========================

window.deleteNode = async function(id){


    try{


        // Check children

        const q = query(

            collection(db,"nodes"),

            where(
                "parentId",
                "==",
                id
            )

        );


        const childSnap =
        await getDocs(q);



        if(childSnap.size > 0){


            alert(
                "This item has child content. Delete children first."
            );


            return;

        }




        const confirmDelete = confirm(
            "Delete this item?"
        );



        if(!confirmDelete){

            return;

        }




        await deleteDoc(
            doc(db,"nodes",id)
        );



        alert(
            "Deleted Successfully"
        );



        loadTree();



    }
    catch(error){


        console.error(
            "Delete Error:",
            error
        );


        alert(
            error.message
        );


    }


};
// ===========================
// EDIT NODE
// ===========================

window.editNode = async function(id){


    const newName = prompt(
        "Enter new name:"
    );


    if(!newName || newName.trim()===""){
        return;
    }


    try{


        await updateDoc(
            doc(db,"nodes",id),
            {
                name:newName.trim()
            }
        );


        alert(
            "Updated Successfully"
        );


        loadTree();


    }
    catch(error){


        console.error(
            "Edit Error:",
            error
        );


        alert(
            error.message
        );

    }


};
// ===========================
// LOAD CHAPTERS FOR MATERIAL
// ===========================

async function loadChapters(){


    if(!chapterSelect) return;


    chapterSelect.innerHTML =
    `<option value="">
    Select Chapter
    </option>`;


    try{


        const q = query(

            collection(db,"nodes"),

            where(
                "type",
                "==",
                "Chapter"
            )

        );


        const snap =
        await getDocs(q);



        console.log(
            "Chapters Found:",
            snap.size
        );



        snap.forEach(function(doc){


            const item = doc.data();



            chapterSelect.innerHTML += `

            <option value="${doc.id}">
                ${item.name}
            </option>

            `;


        });



    }
    catch(error){


        console.error(
            "Chapter Load Error:",
            error
        );


    }


}



loadChapters();


// ===========================
// SAVE MATERIAL
// ===========================

if(materialForm){

    materialForm.addEventListener(
    "submit",
    async function(e){

        e.preventDefault();

        if(
            chapterSelect.value === "" ||
            materialTitle.value.trim() === ""
        ){

            alert("Please fill required fields");
            return;

        }


        const materialData = {

            chapterId: chapterSelect.value,

            type: materialType.value,

            title: materialTitle.value.trim(),

            url: materialURL.value.trim(),

            createdAt: serverTimestamp()

        };


        try{


            await addDoc(
                collection(db,"materials"),
                materialData
            );


            alert(
                "Material Saved Successfully"
            );


            materialForm.reset();


        }
        catch(error){

            console.error(error);

            alert(error.message);

        }


    });

}
// ===========================
// FILE UPLOAD ELEMENTS
// ===========================

const dropArea = document.getElementById("dropArea");
const materialFile = document.getElementById("materialFile");
const fileName = document.getElementById("fileName");

let selectedFile = null;


// Click → Open File Picker

dropArea.addEventListener("click", () => {

    materialFile.click();

});


// File Selected

materialFile.addEventListener("change", () => {

    if(materialFile.files.length > 0){

        selectedFile = materialFile.files[0];

        fileName.innerHTML =
        "📄 " + selectedFile.name;

    }

});


// Drag Over

dropArea.addEventListener("dragover", (e) => {

    e.preventDefault();

    dropArea.classList.add("dragover");

});


// Drag Leave

dropArea.addEventListener("dragleave", () => {

    dropArea.classList.remove("dragover");

});


// Drop File

dropArea.addEventListener("drop", (e) => {

    e.preventDefault();

    dropArea.classList.remove("dragover");

    selectedFile = e.dataTransfer.files[0];

    fileName.innerHTML =
    "📄 " + selectedFile.name;

});
const quill = new Quill("#editor", {
    theme: "snow",

    placeholder: "Write Study Notes Here...",

    modules: {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"]
        ]
    }
});
const materialType = document.getElementById("materialType");

const notesEditorContainer =
document.getElementById("notesEditorContainer");

materialType.addEventListener("change", () => {

    if (materialType.value === "Notes") {

        notesEditorContainer.style.display = "block";

    } else {

        notesEditorContainer.style.display = "none";

    }

});
const materialType = document.getElementById("materialType");
const notesEditorContainer = document.getElementById("notesEditorContainer");
const dropArea = document.getElementById("dropArea");

materialType.addEventListener("change", () => {

    if (materialType.value === "Notes") {

        notesEditorContainer.style.display = "block";
        dropArea.style.display = "none";

    } else {

        notesEditorContainer.style.display = "none";
        dropArea.style.display = "block";

    }

});