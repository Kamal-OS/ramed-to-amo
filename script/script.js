let inputBox = document.getElementById('numero');
let urlText = document.getElementById('url');
let submitButton = document.getElementById('submit');

inputBox.onkeyup = () => {
    let inputBase64 = btoa(inputBox.value);
    urlText.href = "https://digital.cnss.ma/certificat_pipc/?" + inputBase64;
    urlText.innerText = inputBase64;
}

// Prevent arrow keys to change input number
inputBox.onkeydown = (e) => {
    if (e.key == "ArrowUp" || e.key == "ArrowDown") {
        e.preventDefault();
    }
}

let download = require("./download.pdf");
submitButton.onclick = () => {
    let url = 'https://digital.cnss.ma/certificat_pipc/get_document.php'
    return fetch(url, {
        method: 'GET',
        headers: {
            'Referer': 'https://digital.cnss.ma/certificat_pipc/?OTMyNzIyNzA0'
        }
    }).then(function(resp) {
        return resp.blob();
    }).then(function(blob) {
        download(blob);
    })
}