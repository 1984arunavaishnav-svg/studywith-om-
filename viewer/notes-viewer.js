const params =
new URLSearchParams(window.location.search);

const title =
params.get("title");

const content =
params.get("content");

document.getElementById("notesTitle").innerHTML =
title || "Notes";

document.getElementById("notesContent").innerHTML =
content || "No Notes Found";