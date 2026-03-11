const button = document.getElementById("toggleButton");
const text = document.getElementById("extraText");

button.addEventListener("click", function() {

    if (text.style.display === "none") {
        text.style.display = "block";
        button.textContent = "Weniger anzeigen";
    } else {
        text.style.display = "none";
        button.textContent = "Mehr anzeigen";
    }

});