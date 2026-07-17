import { db } from "../firebase/firebase-config.js";

import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


// URL से chapter id लेना

const params = new URLSearchParams(
    window.location.search
);


const chapterId = params.get("chapterId");


console.log(
    "Chapter ID:",
    chapterId
);



const lectureBtn =
document.getElementById("lectureBtn");

const notesBtn =
document.getElementById("notesBtn");

const pdfBtn =
document.getElementById("pdfBtn");




async function loadMaterial(){


    if(!chapterId){

        console.log(
            "Chapter ID Missing"
        );

        return;

    }



    const q = query(

        collection(db,"materials"),

        where(
            "chapterId",
            "==",
            chapterId
        )

    );



    const snap =
    await getDocs(q);



    console.log(
        "Materials Found:",
        snap.size
    );



    snap.forEach((doc)=>{


        const data =
        doc.data();



        console.log(
            data
        );



        if(data.type==="PDF"){


            pdfBtn.onclick=function(){

                window.open(
                    data.url,
                    "_blank"
                );

            };

        }



        if(data.type==="Video"){


            lectureBtn.onclick=function(){

                window.open(
                    data.url,
                    "_blank"
                );

            };

        }



    });


}



loadMaterial();