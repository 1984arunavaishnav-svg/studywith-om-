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