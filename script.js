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
    btn.style = 0.5
    btn.style.pointerEvents = "none"
    btn.disabled = true
}

// Prevent arrow keys to change input number
// Restricts input for the given textbox to the given inputFilter function.
function setInputFilter(btn, textbox, inputFilter, inputLength) {
    let escapeLength = false;
    if (!inputLength) escapeLength = true;
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop", "focusout"].forEach(function (event) {
        textbox.addEventListener(event, function (e) {
            if (inputFilter(this.value) && (escapeLength || Number(textbox.value.length) <= inputLength)) {
                // Accepted value.
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;

                if ((escapeLength && textbox.value.length >= 1) || textbox.value.length >= inputLength) {
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
    const url = "https://digital.cnss.ma/certificat_pipc/?" + btoa(numberInput.value);
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

var phoneDiv = document.querySelector(".phone .main-content")

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

// const searchInput = document.getElementById("commune-input");
// const searchBtn = document.getElementById("commune-btn");

// searchInput.value = ""

// searchInput.addEventListener("input", () => {
//     if (searchInput.value != "") {
//         enableBtn(searchBtn)
//     }
//     else {
//         disableBtn(searchBtn)
//     }
// })

// searchBtn.addEventListener('click', () => {
//     fetch('db/communes.json')
//         .then((response) => response.json())
//         .then((data) => {
//             for (var i = 0; i < data.length; i += 2) {
//                 targets = searchInput.value.split(" ")
//                 targets.forEach(target => {
//                     if (data[i].search(target)) {
                        
//                     }
//                 })
//             }
//         });
// })

const searchInput = document.querySelector("#search")
const resultDiv = document.querySelector("#result")

searchInput.value = ""

function autocomplete(inp, arr) {
    let currentFocus
    inp.addEventListener('input', function(e) {
        let a
        let b
        let i
        let inputValue = this.value

        closeAllLists()
        resultDiv.innerText = "لا توجد نتائج."

        if (!inputValue) { return false;}
        
        currentFocus = -1

        a = document.createElement('DIV')
        a.setAttribute('id', this.id + "autocomplete-list")
        a.setAttribute('class', "autocomplete-items")
        this.parentNode.appendChild(a)

        for (const [key, value] of Object.entries(arr[0])) {
            let isKsar = false
            if (key === "القصور") isKsar = true

            for (i = 0; i < value.length; ++i) {
                // TODO: search for each token in user input
                // and sort the list so results wich contains more tokens be first
                const item = normalizeArabic(value[i])
                const searchToken = normalizeArabic(inputValue)

                const matchPos = item.toLowerCase().search(searchToken.toLowerCase())
                if (matchPos !== -1) {
                    b = document.createElement("DIV")
                    
                    b.innerHTML = value[i].slice(0, matchPos)
                    b.innerHTML += "<strong>" + value[i].slice(matchPos, matchPos + inputValue.length) + "</strong>"
                    b.innerHTML += value[i].slice(matchPos + inputValue.length)
                    b.innerHTML += `<input type="hidden" value="${value[i]}">`
                    if (isKsar) b.innerHTML += `<input type="hidden" value="${value[i+1]}">`
                    else b.innerHTML += `<input type="hidden" value="${key}">`

                    b.addEventListener('click', function(e) {
                        const result = this.querySelectorAll('input')
                        inp.value = result[0].value
                        let resultToken = result[1].value
                        const resultPos = resultToken.search("يقع")
                        if (resultPos !== -1) resultToken = resultToken.slice(resultPos + 5, resultToken.search("،"))
                        resultDiv.innerHTML = `<span style="font-weight: 600">${resultToken}</span>`
                        closeAllLists()
                    })

                    a.appendChild(b)
                }

                if (isKsar) ++i
            }
        }
    })

    inp.addEventListener('keydown', function(e) {
        var x = document.getElementById(this.id + "autocomplete-list")
        if (x) x = x.getElementsByTagName('div')
        
        // Arrow Down key is pressed
        if (e.keyCode == 40) {
            e.preventDefault()
            currentFocus++
            addActive(x)
        }
        // Up
        else if (e.keyCode == 38) {
            e.preventDefault()
            currentFocus--
            addActive(x)
        }
        // Enter
        else if (e.keyCode == 13) {
            e.preventDefault()
            if (currentFocus > -1) {
                if (x) x[currentFocus].click()
            }
        }

    })

    function addActive(x) {
        if (!x || x.length <= 0) return false

        removeActive(x)

        if (currentFocus >= x.length) currentFocus = 0
        if (currentFocus < 0) currentFocus = (x.length - 1)

        x[currentFocus].classList.add("autocomplete-active")
    }

    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active")
        }
    }

    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items")
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i])
            }
        }
    }

    function normalizeArabic(token) {
        let normToken = token
        normToken = normToken.replaceAll("أ", "ا")
        normToken = normToken.replaceAll("إ", "ا")
        normToken = normToken.replaceAll("آ", "ا")
        normToken = normToken.replaceAll("ث", "ت")
        normToken = normToken.replaceAll("ذ", "د")
        normToken = normToken.replaceAll("ي", "ى")
        return normToken
    }

    // when click somewhere
    // close all lists
    // except the one we clicked on
    document.addEventListener('click', function (e) {
        closeAllLists(e.target)
    })
}

let data = await fetch('./communes.json')
    .then((response) => response.json())
    .then((json) => {
        return json
    });

autocomplete(searchInput, data)


/***
 * RNP
 */

const rnpInput = document.querySelector("#rnp-input")
const rnpSubmit = document.querySelector("#rnp-submit")

rnpInput.value = ""

rnpInput.addEventListener("input", () => {
    if (rnpInput.value != "") {
        enableBtn(rnpSubmit)
    }
    else {
        disableBtn(rnpSubmit)
    }
})

setInputFilter(rnpSubmit, rnpInput, function (value) {
    return /^\d*?\d*$/.test(value); // Allow digits and '.' only, using a RegExp.
}, 14)

rnpSubmit.addEventListener("click", e => {
    e.preventDefault();
    const url = rnpSelect.value.replace('11111111111111', rnpInput.value);
    window.open(url, '_blank');
    numberInput.setSelectionRange(0, numberInput.value.length)
});

const array = [
    {
        name: "البيانات الديموغرافية",
        url: "https://www.rnp.ma/pre-registration-ui/#/ara/pre-registration/demographic/11111111111111"
    },
    {
        name: "تحميل الوثائق",
        url: "https://www.rnp.ma/pre-registration-ui/#/ara/pre-registration/file-upload/11111111111111"
    },
    {
        name: "مراجعة البيانات",
        url: "https://www.rnp.ma/pre-registration-ui/#/ara/pre-registration/summary/11111111111111/preview"
    },
    {
        name: "حجز موعد",
        url: "https://www.rnp.ma/pre-registration-ui/#/ara/pre-registration/booking/11111111111111/pick-center"
    },
    {
        name: "تأكيد",
        url: "https://www.rnp.ma/pre-registration-ui/#/ara/pre-registration/summary/11111111111111/acknowledgement"
    },
]

const rnpSelect = document.querySelector("#rnp-links")

function setRNPSelection(select, array) {
    
    for (const [index, item] of array.entries()) {
        const option = document.createElement("option")
        option.value = item.url

        option.innerText = `المرحلة ${index + 1} - ${item.name}`
        select.appendChild(option)
    }
}

setRNPSelection(rnpSelect, array)
rnpSelect.value = array[1].url
