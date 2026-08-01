const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const summaryLinks = document.querySelectorAll(".summary-list a");
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

        summaryLinks.forEach((link) => link.classList.remove("active"));
        const activeSummary = document.querySelector(`.summary-list a[data-index="${index}"]`);
        if (activeSummary) activeSummary.classList.add("active");
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

const chartPalette = ["#34506a", "#1f8a72", "#d99a2b", "#c0563b"];

function buildPieChart(labels, values) {
  const total = values.reduce((sum, v) => sum + v, 0);
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  let cumulative = 0;

  const segments = labels
    .map((label, i) => {
      const dash = (values[i] / total) * circumference;
      const circle = `<circle cx="60" cy="60" r="${radius}" fill="none" stroke="${chartPalette[i % chartPalette.length]}" stroke-width="20" stroke-dasharray="${dash} ${circumference - dash}" stroke-dashoffset="${-cumulative}" transform="rotate(-90 60 60)" />`;
      cumulative += dash;
      return circle;
    })
    .join("");

  const legend = labels
    .map(
      (label, i) =>
        `<li><span class="legend-swatch" style="background:${chartPalette[i % chartPalette.length]}"></span>${label} - ${values[i]}</li>`
    )
    .join("");

  return `
    <div class="pie-wrap">
      <svg class="pie-svg" viewBox="0 0 120 120">${segments}</svg>
      <ul class="pie-legend">${legend}</ul>
    </div>
  `;
}

function buildBarChart(labels, values) {
  const max = Math.max(...values);
  const rows = labels
    .map((label, i) => {
      const widthPct = (values[i] / max) * 100;
      return `
        <div class="bar-row">
          <span class="bar-label">${label}</span>
          <div class="bar-track"><div class="bar-fill" style="width:${widthPct}%; background:${chartPalette[i % chartPalette.length]}"></div></div>
          <span class="bar-value">${values[i]}</span>
        </div>
      `;
    })
    .join("");

  return `<div class="bar-chart">${rows}</div>`;
}

document.querySelectorAll(".chart").forEach((el) => {
  const labels = el.dataset.labels.split(",");
  const values = el.dataset.values.split(",").map(Number);
  el.innerHTML =
    el.dataset.chart === "pie" ? buildPieChart(labels, values) : buildBarChart(labels, values);
});

const menuToggle = document.getElementById("menu-toggle");
const summaryPanel = document.getElementById("summary-panel");
const summaryBackdrop = document.getElementById("summary-backdrop");
const summaryClose = document.getElementById("summary-close");

function openSummary() {
  menuToggle.classList.add("open");
  summaryPanel.classList.add("open");
  summaryBackdrop.classList.add("open");
  menuToggle.setAttribute("aria-expanded", "true");
  summaryPanel.setAttribute("aria-hidden", "false");
}

function closeSummary() {
  menuToggle.classList.remove("open");
  summaryPanel.classList.remove("open");
  summaryBackdrop.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  summaryPanel.setAttribute("aria-hidden", "true");
}

menuToggle.addEventListener("click", () => {
  summaryPanel.classList.contains("open") ? closeSummary() : openSummary();
});

summaryBackdrop.addEventListener("click", closeSummary);
summaryClose.addEventListener("click", closeSummary);
summaryLinks.forEach((link) => link.addEventListener("click", closeSummary));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeSummary();
});

const lightbox = document.getElementById("image-lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxClose = document.getElementById("lightbox-close");

function openLightbox(src, alt) {
  lightboxImage.src = src;
  lightboxImage.alt = alt;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
}

document.querySelectorAll(".zoomable-image").forEach((button) => {
  button.addEventListener("click", () => {
    const img = button.querySelector("img");
    openLightbox(button.dataset.full || img.src, img.alt);
  });
});

lightbox.addEventListener("click", closeLightbox);
lightboxClose.addEventListener("click", closeLightbox);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});

document.querySelectorAll(".phone-screen [data-goto]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.goto;
    const screen = button.closest(".phone-screen");
    screen.querySelectorAll(".app-screen").forEach((s) => {
      s.classList.toggle("active", s.dataset.screen === target);
    });
  });
});

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
