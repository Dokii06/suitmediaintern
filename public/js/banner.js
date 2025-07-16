// Parallax banner
window.addEventListener("scroll", () => {
    const banner = document.querySelector(".parallax-img");
    if (banner) {
        const scrollY = window.scrollY;
        banner.style.transform = `translateY(${scrollY * 0.5}px)`;
    }
});

