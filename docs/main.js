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