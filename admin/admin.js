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

form.addEventListener("submit", async (e)=>{

    e.preventDefault();


    if(nameInput.value.trim() === ""){

        alert("Please enter name");

        return;

    }


    const data = {

        name:nameInput.value.trim(),

        type:type.value,

        parentId: parent.value || null,

        order:Number(order.value) || 1,

        status:status.value === "Active",

        createdAt:serverTimestamp()

    };


    console.log("Saving...",data);



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
            "Content Saved Successfully ✅"
        );


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


            const item = doc.data();



            parent.innerHTML += `

            <option value="${doc.id}">
                ${item.name}
            </option>

            `;


        });



    }
    catch(error){


        console.error(
            "Parent Error:",
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



        let nodes = [];



        snapshot.forEach((doc)=>{


            nodes.push({

                id:doc.id,

                ...doc.data()

            });


        });



        console.log(
            "Tree Documents:",
            nodes.length
        );



        function buildTree(parentId=null, level=0){


            let html="";



            nodes

            .filter(node =>
                node.parentId === parentId
            )

            .sort((a,b)=>
                (a.order||0)-(b.order||0)
            )


            .forEach(node=>{



                let icon="□";



                if(node.type==="Category")
                    icon="▣";


                else if(node.type==="Board")
                    icon="▤";


                else if(node.type==="Class")
                    icon="▦";


                else if(node.type==="Subject")
                    icon="■";



                html += `


                <div class="tree-item"
                style="margin-left:${level*25}px">


                    <span class="tree-icon">
                        ${icon}
                    </span>


                    ${node.name}


                    <small>
                    (${node.type})
                    </small>


                </div>


                `;



                html += buildTree(
                    node.id,
                    level+1
                );


            });



            return html;


        }



        tree.innerHTML =
        buildTree();



    }
    catch(error){


        console.error(
            "Tree Error:",
            error
        );


        tree.innerHTML =
        "Error Loading Tree";


    }


}



// Load tree when page opens

loadTree();