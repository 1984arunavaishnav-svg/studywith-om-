import { db } from "../firebase/firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const quizId = params.get("quizId"); // Admin panel se hum quizId pass karenge

let questions = [];
let currentIndex = 0;

async function fetchQuiz() {
    const docRef = doc(db, "quizzes", quizId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        document.getElementById("quizTitle").innerText = data.title;
        questions = data.questions; // Array of questions
        showQuestion();
    }
}

function showQuestion() {
    const q = questions[currentIndex];
    document.getElementById("question").innerText = q.text;
    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";

    q.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.innerText = opt;
        btn.onclick = () => {
            if (opt === q.correct) {
                alert("Sahi jawab!");
            } else {
                alert("Galat jawab!");
            }
        };
        optionsDiv.appendChild(btn);
    });
}

document.getElementById("nextBtn").onclick = () => {
    currentIndex++;
    if (currentIndex < questions.length) {
        showQuestion();
    } else {
        alert("Quiz khatam!");
    }
};

fetchQuiz();