// ===========================================
// StudyWithOm CMS
// Tree Module
// ===========================================

import { db } from "./firebase.js";

import {

    collection,
    getDocs

} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";



// ===========================================
// EXPORT
// ===========================================

export function initTree(){

    console.log("Tree Module Loaded");

    loadTree();

}



// ===========================================
// ELEMENT
// ===========================================

const tree =

document.getElementById("tree");



// ===========================================
// LOAD TREE
// ===========================================

export async function loadTree(){

    if(!tree){

        return;

    }

    tree.innerHTML="Loading...";

    try{

        const snap=

        await getDocs(

            collection(db,"nodes")

        );

        let nodes=[];

        snap.forEach(doc=>{

            nodes.push({

                id:doc.id,

                ...doc.data()

            });

        });

        buildTree(nodes);

    }

    catch(error){

        console.error(error);

        tree.innerHTML="Load Error";

    }

}



// ===========================================
// BUILD TREE
// ===========================================

function buildTree(nodes){

    function makeTree(parentId,level){

        let html="";

        nodes

        .filter(node=>node.parentId===parentId)

        .sort((a,b)=>

        (a.order||0)-(b.order||0))

        .forEach(node=>{

            html+=createNode(node,level);

            html+=makeTree(

                node.id,

                level+1

            );

        });

        return html;

    }

    tree.innerHTML=

    makeTree(null,0);

}
// ===========================================
// NODE ICON
// ===========================================

function getIcon(type){

    switch(type){

        case "Category":
            return "📁";

        case "Board":
            return "🗂";

        case "Class":
            return "🎓";

        case "Subject":
            return "📚";

        case "Chapter":
            return "📖";

        default:
            return "📄";

    }

}



// ===========================================
// CREATE NODE
// ===========================================

function createNode(node,level){

    return `

    <div
        class="tree-item"
        style="margin-left:${level*25}px">

        <span class="tree-icon">

            ${getIcon(node.type)}

        </span>

        <span class="tree-name">

            ${node.name}

        </span>

        <span class="tree-type">

            (${node.type})

        </span>

        <div class="tree-actions">

            <button

                class="editBtn"

                onclick="editNode('${node.id}')">

                <i class="fa-solid fa-pen"></i>

            </button>

            <button

                class="deleteBtn"

                onclick="deleteNode('${node.id}')">

                <i class="fa-solid fa-trash"></i>

            </button>

        </div>

    </div>

    `;

}



// ===========================================
// REFRESH TREE
// ===========================================

window.loadTree = loadTree;



// ===========================================
// AUTO REFRESH
// ===========================================

window.refreshTree=function(){

    loadTree();

};



// ===========================================
// TREE READY
// ===========================================

console.log("Tree UI Ready");
// ===========================================
// TREE SEARCH
// ===========================================

window.searchTree = function (keyword) {

    keyword = keyword.toLowerCase();

    const items = document.querySelectorAll(".tree-item");

    items.forEach(item => {

        const text = item.innerText.toLowerCase();

        if (text.includes(keyword)) {

            item.style.display = "flex";

        } else {

            item.style.display = "none";

        }

    });

};



// ===========================================
// TOTAL NODE COUNT
// ===========================================

window.totalTreeNodes = async function () {

    try {

        const snap = await getDocs(

            collection(db, "nodes")

        );

        const total = snap.size;

        console.log("Total Nodes :", total);

        const counter = document.getElementById("treeCount");

        if (counter) {

            counter.innerHTML = total;

        }

    }

    catch (error) {

        console.error(error);

    }

};



// ===========================================
// COLLAPSE / EXPAND READY
// ===========================================

window.expandAllTree = function () {

    document.querySelectorAll(".tree-item").forEach(item => {

        item.style.display = "flex";

    });

};



window.collapseTree = function () {

    document.querySelectorAll(".tree-item").forEach(item => {

        if (item.style.marginLeft !== "0px") {

            item.style.display = "none";

        }

    });

};



// ===========================================
// TREE RELOAD
// ===========================================

window.reloadTree = async function () {

    await loadTree();

    await totalTreeNodes();

};



// ===========================================
// AUTO REFRESH
// ===========================================

window.addEventListener("focus", () => {

    loadTree();

});



// ===========================================
// HEALTH CHECK
// ===========================================

window.treeHealth = async function () {

    try {

        const snap = await getDocs(

            collection(db, "nodes")

        );

        console.table({

            "Module": "Tree",

            "Status": "Working",

            "Nodes": snap.size,

            "Firestore": "Connected"

        });

    }

    catch (error) {

        console.error(error);

    }

};



// ===========================================
// INITIALIZE
// ===========================================

totalTreeNodes();

console.log("=================================");
console.log("StudyWithOm Tree Module Ready");
console.log("=================================");