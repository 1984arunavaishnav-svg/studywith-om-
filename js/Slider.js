const track = document.querySelector(".slider-track");
const slides = document.querySelectorAll(".slider-track img");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");

let index = 0;
function updateSlider() {
    track.style.transform = `translateX(-${index * (100 / slides.length)}%)`;
}

function nextSlide() {
    index = (index + 1) % slides.length;
    updateSlider();
}

function prevSlide() {
    index = (index - 1 + slides.length) % slides.length;
    updateSlider();
}

let autoSlide = setInterval(nextSlide, 5000);

next.addEventListener("click", () => {
    nextSlide();
    clearInterval(autoSlide);
    autoSlide = setInterval(nextSlide, 5000);
});

prev.addEventListener("click", () => {
    prevSlide();
    clearInterval(autoSlide);
    autoSlide = setInterval(nextSlide, 5000);
});
