import { db } from "../firebase/firebase-config.js";

import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


// ===========================
// GET CHAPTER FROM URL
// ===========================

const params = new URLSearchParams(window.location.search);


const chapterName = params.get("chapter");

console.log("Chapter:", chapterName);


// ===========================
// BUTTONS
// ===========================

const lectureBtn =
document.getElementById("lectureBtn");


const notesBtn =
document.getElementById("notesBtn");


const pdfBtn =
document.getElementById("pdfBtn");



// ===========================
// LOAD MATERIAL
// ===========================

async function loadMaterial(){


    try{


        const q = query(

            collection(db,"materials"),

            where(
                "title",
                "==",
                chapterName
            )

        );



        const snap =
        await getDocs(q);



        console.log(
            "Materials Found:",
            snap.size
        );



        snap.forEach((doc)=>{


            const data = doc.data();



            console.log(
                "Material:",
                data
            );



            if(data.type === "PDF"){

                pdfBtn.onclick = function(){

                    window.open(
                        data.url,
                        "_blank"
                    );

                };

            }



            if(data.type === "Video"){

                lectureBtn.onclick = function(){

                    window.open(
                        data.url,
                        "_blank"
                    );

                };

            }



            if(data.type === "Notes"){

                notesBtn.onclick = function(){

                    window.open(
                        data.url,
                        "_blank"
                    );

                };

            }



        });



    }
    catch(error){

        console.error(
            "Material Load Error:",
            error
        );

    }


}



loadMaterial();