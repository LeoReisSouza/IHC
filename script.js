const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const progressBar = document.getElementById("progress-bar");
const scrollContainer = document.getElementById("scroll-container");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");

        const index = entry.target.dataset.index;
        dots.forEach((dot) => dot.classList.remove("active"));
        const activeDot = document.querySelector(`.dot[data-index="${index}"]`);
        if (activeDot) activeDot.classList.add("active");
      }
    });
  },
  { threshold: 0.5 }
);

slides.forEach((slide) => observer.observe(slide));

function updateProgressBar() {
  const scrollTop = scrollContainer.scrollTop;
  const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;
}

scrollContainer.addEventListener("scroll", updateProgressBar);
updateProgressBar();

document.querySelectorAll(".accordion").forEach((accordion) => {
  const items = accordion.querySelectorAll(".accordion-item");
  items.forEach((item) => {
    const header = item.querySelector(".accordion-header");
    header.addEventListener("click", () => {
      const isActive = item.classList.contains("active");
      items.forEach((other) => {
        other.classList.remove("active");
        other.querySelector(".accordion-header").setAttribute("aria-expanded", "false");
      });
      if (!isActive) {
        item.classList.add("active");
        header.setAttribute("aria-expanded", "true");
      }
    });
  });
});
