const params =
new URLSearchParams(window.location.search);


const url =
params.get("url");


const title =
params.get("title");



document.getElementById("pdfTitle").innerHTML =
title || "Study Material";



const frame =
document.getElementById("pdfFrame");


frame.src = url;



document.getElementById("downloadBtn").onclick = function(){

    window.open(url,"_blank");

};
