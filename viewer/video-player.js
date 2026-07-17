const params =
new URLSearchParams(window.location.search);


const url =
params.get("url");


const title =
params.get("title");



document.getElementById("videoTitle").innerHTML =
title || "Study Material";



const video =
document.getElementById("videoPlayer");


video.src = url;