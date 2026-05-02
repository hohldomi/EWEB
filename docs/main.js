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


// ─── F1 API ──────────────────────────────────────────────────────
// REST GET-Request auf öffentliche JSON-API (kein API-Key nötig)
// Demonstriert: fetch(), async/await, JSON-Verarbeitung, Fehlerbehandlung

const F1_API_URL = "https://api.jolpi.ca/ergast/f1/2026/driverstandings/";

async function loadF1Standings() {
    const loadingEl = document.getElementById("f1-loading");
    const errorEl   = document.getElementById("f1-error");
    const listEl    = document.getElementById("f1-standings");

    try {
        // GET-Request → JSON-Response (wie in den Slides: fetch + response.json())
        const response = await fetch(F1_API_URL);

        if (!response.ok) {
            throw new Error(`HTTP-Fehler: ${response.status}`);
        }

        const data = await response.json();

        // JSON-Struktur der API navigieren
        const standings = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;

        // Ladeanzeige ausblenden, Liste einblenden
        loadingEl.style.display = "none";
        listEl.style.display    = "block";

        // Top 10 Fahrer rendern
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
        // Fehlerbehandlung: Nutzerfreundliche Fehlermeldung anzeigen
        loadingEl.style.display = "none";
        errorEl.style.display   = "block";
        errorEl.textContent     = `Daten konnten nicht geladen werden. (${error.message})`;
        console.error("F1 API Fehler:", error);
    }
}

// API-Aufruf beim Laden der Seite
loadF1Standings();