import { db } from "../firebase/firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const noteId = params.get("id"); // Admin Panel se mili ID

async function loadNote() {
    if (!noteId) return;
    
    const docRef = doc(db, "materials", noteId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
        const data = snap.data();
        document.getElementById("notesTitle").innerText = data.title;
        // PDF Viewer mein link daal dein
        document.getElementById("pdfViewer").innerHTML = `
            <iframe src="https://docs.google.com/gview?url=${data.url}&embedded=true" 
                    style="width:100%; height:80vh;" frameborder="0"></iframe>`;
    }
}
loadNote();