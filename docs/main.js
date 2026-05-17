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