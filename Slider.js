const track = document.querySelector(".slider-track");
const slides = document.querySelectorAll(".slider-track img");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");

let index = 0;
const totalSlides = slides.length;

// Slider Update
function updateSlider() {
    track.style.transform = `translateX(-${index * 100}%)`;
}

// Next Slide
function nextSlide() {
    index++;
    if (index >= totalSlides) {
        index = 0;
    }
    updateSlider();
}

// Previous Slide
function prevSlide() {
    index--;
    if (index < 0) {
        index = totalSlides - 1;
    }
    updateSlider();
}

// Auto Slide
let autoSlide = setInterval(nextSlide, 5000);

// Buttons
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
