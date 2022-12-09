const numberInput = document.querySelector("input");
const generateBtn = document.querySelector("button");

numberInput.focus();

// Prevent arrow keys to change input number
numberInput.addEventListener("keydown", e => {
    if (e.key == "ArrowUp" || e.key == "ArrowDown") {
        e.preventDefault();
    }
});

generateBtn.addEventListener("click", e => {
    e.preventDefault();
    url = "https://digital.cnss.ma/certificat_pipc/?" + btoa(numberInput.value);
    generateBtn.innerText = "Ouverture de l'URL...";
    window.open(url, '_blank');
    generateBtn.innerText = "Générer";
});

function fetchFile(url) {
}


