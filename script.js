/*******
 * AMO
 */

const numberInput = document.getElementById("amo-input");
const generateBtn = document.getElementById("amo-btn");

numberInput.value = ""
numberInput.focus()

function enableBtn(btn) {
    btn.style.opacity = 1
    btn.style.pointerEvents = "auto"
    btn.disabled = false
}

function disableBtn(btn) {
    btn.style = 0.7
    btn.style.pointerEvents = "none"
    btn.disabled = true
}

// Prevent arrow keys to change input number
// Restricts input for the given textbox to the given inputFilter function.
function setInputFilter(btn, textbox, inputFilter, inputLength) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop", "focusout"].forEach(function (event) {
        textbox.addEventListener(event, function (e) {
            if (inputFilter(this.value) && Number(textbox.value.length) <= inputLength) {
                // Accepted value.
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;

                if (inputLength == -1 || textbox.value.length == inputLength) {
                    enableBtn(btn)
                }
                else {
                    disableBtn(btn)
                }
            }
            else if (this.hasOwnProperty("oldValue")) {
                // Rejected value: restore the previous one.
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            }
            else {
                // Rejected value: nothing to restore.
                this.value = "";
            }
        });
    });
}

setInputFilter(generateBtn, numberInput, function (value) {
    return /^\d*?\d*$/.test(value); // Allow digits and '.' only, using a RegExp.
}, 9)

generateBtn.addEventListener("click", e => {
    e.preventDefault();
    url = "https://digital.cnss.ma/certificat_pipc/?" + btoa(numberInput.value);
    generateBtn.innerText = "Ouverture de l'URL...";
    window.open(url, '_blank');
    generateBtn.innerText = "Générer";
    numberInput.setSelectionRange(0, numberInput.value.length)
});

/***
 *  Phone
 * ***/

let vendors = [
    {
        vendor: "iam",
        name: "IAM",
        methods: ["#111*2*3#", "#111#", "555"],
        counter: 0,
        color: "#0A5196"
    },
    {
        vendor: "inwi",
        name: "INWI",
        methods: ["#99#", "#120#", "120"],
        counter: 0,
        color: "#9A3488"
    },
    {
        vendor: "orange",
        name: "ORANGE",
        methods: ["#555*1*2#", "#555#", "555"],
        counter: 0,
        color: "#FF7900"
    }
]

var phoneDiv = document.getElementById("phone-content")

for (var {vendor, name, methods, color} of vendors) {
    phoneDiv.innerHTML += `
        <div class="${vendor}">
            <h2 style="color: white;background-color: ${color}">${name}</h2>
            <div class="methods">
                <p>Appeler <span id="btn-${vendor}">${methods[0]}</span></p>
            </div>
        </div>
    `
}


phoneDiv.addEventListener('click', e => {
    if (e.target.matches('span')) {
        for (var i = 0; i < vendors.length; ++i) {
            if (e.target.id == `btn-${vendors[i].vendor}`) {
                vendors[i].counter++
                if (vendors[i].counter >= vendors[i].methods.length) {
                    vendors[i].counter = 0
                }
                e.target.innerText = vendors[i].methods[vendors[i].counter]
            }
        }
        e.stopPropagation();
    }
})

/***
 * Moteur de recherche
 */

const searchInput = document.getElementById("commune-input");
const searchBtn = document.getElementById("commune-btn");

searchInput.value = ""

searchInput.addEventListener("input", () => {
    if (searchInput.value != "") {
        enableBtn(searchBtn)
    }
    else {
        disableBtn(searchBtn)
    }
})

searchBtn.addEventListener('click', () => {
    fetch('db/communes.json')
        .then((response) => response.json())
        .then((data) => {
            for (var i = 0; i < data.length; i += 2) {
                targets = searchInput.value.split(" ")
                console.log(targets)
            }
        });
})
