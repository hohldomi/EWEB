// ─── Toggle Button ───────────────────────────────────────────────
const button = document.getElementById("toggleButton");
const text = document.getElementById("extraText");

button.addEventListener("click", function () {
    const isHidden = text.style.display === "" || text.style.display === "none";

    if (isHidden) {
        text.style.display = "block";
        button.textContent = "Weniger anzeigen";
    } else {
        text.style.display = "none";
        button.textContent = "Mehr anzeigen";
    }
});


// ─── Hamburger Nav ───────────────────────────────────────────────
const navToggle = document.getElementById("navToggle");
const navMenu   = document.getElementById("navMenu");

navToggle.addEventListener("click", function () {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", isOpen);
});

navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
    });
});


// ─── Active Nav Highlight (IntersectionObserver) ─────────────────
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll("#navMenu a");

const observerOptions = {
    root: null,
    rootMargin: "-40% 0px -55% 0px",
    threshold: 0
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => link.classList.remove("active"));
            const activeLink = document.querySelector(`#navMenu a[href="#${entry.target.id}"]`);
            if (activeLink) activeLink.classList.add("active");
        }
    });
}, observerOptions);

sections.forEach(section => sectionObserver.observe(section));


// ─── Skill Bars Animation ─────────────────────────────────────────
const skillBars = document.querySelectorAll(".skill-bar-fill");

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bar = entry.target;
            bar.style.width = bar.dataset.width + "%";
            skillObserver.unobserve(bar);
        }
    });
}, { threshold: 0.3 });

skillBars.forEach(bar => skillObserver.observe(bar));


// ─── Kontaktformular Validierung & E-Mail-Versand ─────────────────
const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name    = document.getElementById("contactName");
    const email   = document.getElementById("contactEmail");
    const message = document.getElementById("contactMessage");
    const success = document.getElementById("formSuccess");
    const submitBtn = document.getElementById("contactSubmit");

    const nameError    = document.getElementById("nameError");
    const emailError   = document.getElementById("emailError");
    const messageError = document.getElementById("messageError");

    let valid = true;

    // Name
    if (name.value.trim() === "") {
        name.classList.add("invalid");
        nameError.classList.add("visible");
        valid = false;
    } else {
        name.classList.remove("invalid");
        nameError.classList.remove("visible");
    }

    // E-Mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
        email.classList.add("invalid");
        emailError.classList.add("visible");
        valid = false;
    } else {
        email.classList.remove("invalid");
        emailError.classList.remove("visible");
    }

    // Nachricht
    if (message.value.trim() === "") {
        message.classList.add("invalid");
        messageError.classList.add("visible");
        valid = false;
    } else {
        message.classList.remove("invalid");
        messageError.classList.remove("visible");
    }

    if (valid) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Wird gesendet…";

        try {
            const response = await fetch("https://formspree.io/f/meedrdkr", {
                method: "POST",
                headers: { "Accept": "application/json" },
                body: new FormData(contactForm)
            });

            if (response.ok) {
                success.style.display = "block";
                contactForm.reset();
            } else {
                alert("Fehler beim Senden. Bitte versuche es erneut.");
            }
        } catch (err) {
            alert("Netzwerkfehler. Bitte prüfe deine Verbindung.");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Nachricht senden";
        }
    }
});


// ─── Scroll-to-top Button ─────────────────────────────────────────
const scrollTopBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add("visible");
    } else {
        scrollTopBtn.classList.remove("visible");
    }
});

scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});


// ─── F1 API ──────────────────────────────────────────────────────
const F1_API_URL = "https://api.jolpi.ca/ergast/f1/2026/driverstandings/";

async function loadF1Standings() {
    const loadingEl = document.getElementById("f1-loading");
    const errorEl   = document.getElementById("f1-error");
    const listEl    = document.getElementById("f1-standings");

    try {
        const response = await fetch(F1_API_URL);

        if (!response.ok) {
            errorEl.style.display = "block";
            errorEl.textContent = `Daten konnten nicht geladen werden. (HTTP-Fehler: ${response.status})`;
            loadingEl.style.display = "none";
            return;
        }

        const data = await response.json();

        const standings = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;

        loadingEl.style.display = "none";
        listEl.style.display    = "block";

        standings.slice(0, 10).forEach(entry => {
            const li = document.createElement("li");
            li.classList.add("f1-item");

            li.innerHTML = `
                <span class="f1-position">${entry.position}</span>
                <span class="f1-name">${entry.Driver.givenName} ${entry.Driver.familyName}</span>
                <span class="f1-team">${entry.Constructors[0].name}</span>
                <span class="f1-points">${entry.points} Pts</span>
            `;

            listEl.appendChild(li);
        });

    } catch (error) {
        loadingEl.style.display = "none";
        errorEl.style.display   = "block";
        errorEl.textContent     = `Daten konnten nicht geladen werden. (${error.message})`;
        console.error("F1 API Fehler:", error);
    }
}

loadF1Standings();