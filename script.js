const themeStylesheet = document.createElement("link");
themeStylesheet.rel = "stylesheet";
themeStylesheet.href = "theme.css";
document.head.append(themeStylesheet);

const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }),
  {
    threshold: 0.12,
  },
);

document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));

const scene = document.querySelector("#scene");
const sceneLayer = document.querySelector("#three-scene");

scene?.addEventListener("pointermove", (event) => {
  const box = scene.getBoundingClientRect();
  const x = (event.clientX - box.left) / box.width - 0.5;
  const y = (event.clientY - box.top) / box.height - 0.5;

  sceneLayer.style.transform = `rotateX(${7 - y * 14}deg) rotateY(${-14 + x * 22}deg)`;
});

scene?.addEventListener("pointerleave", () => {
  sceneLayer.style.transform = "rotateX(7deg) rotateY(-14deg)";
});

document.querySelectorAll(".tilt").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const r = card.getBoundingClientRect();
    const x = (event.clientX - r.left) / r.width - 0.5;
    const y = (event.clientY - r.top) / r.height - 0.5;

    card.style.transform = `perspective(900px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg) translateY(-4px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

document.querySelectorAll(".flip-card").forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.toggle("is-flipped");
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      card.classList.toggle("is-flipped");
    }
  });
});

const modal = document.getElementById("contactModal");
const trigger = document.querySelector(".footer-trigger");
const closeButton = document.querySelector(".modal-close");
const form = document.getElementById("contactForm");

const closeModal = () => {
  modal?.classList.remove("open");
  modal?.setAttribute("aria-hidden", "true");
};

const openModal = () => {
  modal?.classList.add("open");
  modal?.setAttribute("aria-hidden", "false");
  document.getElementById("contactName")?.focus();
};

trigger?.addEventListener("click", openModal);
closeButton?.addEventListener("click", closeModal);

modal?.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name =
    document.getElementById("contactName")?.value.trim() || "New connection";
  const occupation =
    document.getElementById("contactRole")?.value.trim() || "Not provided";
  const message =
    document.getElementById("contactMessage")?.value.trim() ||
    "Hello, I’d like to connect.";

  const submitButton = form.querySelector("button[type='submit']");
  const previousText = submitButton?.textContent || "SEND MESSAGE";

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "SENDING...";
  }

  try {
    const response = await fetch("http://127.0.0.1:3000/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, occupation, message }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to send the message.");
    }

    form.reset();
    closeModal();
    alert("Your message was sent successfully.");
  } catch (error) {
    alert(error.message || "Something went wrong while sending the message.");
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = previousText;
    }
  }
});

const themeButton = document.createElement("button");
themeButton.className = "theme-toggle";
themeButton.type = "button";
themeButton.setAttribute("aria-label", "Switch color theme");
themeButton.innerHTML = '<span class="sun">☼</span><span class="moon">☾</span>';
document.querySelector(".nav")?.append(themeButton);

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
}

themeButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark-mode") ? "dark" : "light",
  );
});
