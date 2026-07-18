const params = new URLSearchParams(window.location.search);
const url = params.get("url");
const title = params.get("title");

// टाइटल सेट करें
document.getElementById("videoTitle").innerHTML = title || "Study Material";

const container = document.getElementById("videoContainer");

// वीडियो लोड करने का स्मार्ट लॉजिक
function loadVideo(videoUrl) {
    if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
        // YouTube के लिए Iframe का उपयोग
        let videoId = "";
        if (videoUrl.includes("v=")) {
            videoId = videoUrl.split("v=")[1].substring(0, 11);
        } else {
            videoId = videoUrl.split("/").pop();
        }
        container.innerHTML = `<iframe width="100%" height="400px" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
    } else {
        // MP4 या अन्य फाइल के लिए Video टैग
        container.innerHTML = `<video width="100%" controls><source src="${videoUrl}" type="video/mp4">Your browser does not support the video tag.</video>`;
    }
}

if (url) {
    loadVideo(decodeURIComponent(url));
} else {
    container.innerHTML = "<p>Video link not found.</p>";
}