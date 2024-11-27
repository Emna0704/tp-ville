const baseUrl = 'https://geo.api.gouv.fr';

const selectRegions = document.getElementById("regions")
const selectDepartments = document.getElementById("departments")
const selectCommunes = document.getElementById("communes")
const communesButton = document.getElementById("show-communes")
let departmentCode = ""
const geo = document.getElementById("geo")
const result = document.getElementById("result")

function loadRegions() {
    fetch(`${baseUrl}/regions`)
        .then(response => {
            return response.json();
        }).then(regions => {
            regions.forEach(region => {
                const option = document.createElement("option")
                option.value = region.code
                option.textContent = region.nom
                selectRegions.appendChild(option)
            });
        }
        )
}
function loadDepartments(regionCode) {
    fetch(`${baseUrl}/regions/${regionCode}/departements`).then(response => {
        return response.json();
    }).then(departments => {
        departments.forEach(department => {
            const option = document.createElement("option")
            option.value = department.code
            option.textContent = department.nom
            selectDepartments.appendChild(option)
        });
    })
}
selectRegions.addEventListener("change", (event) => {
    loadDepartments(event.target.value)


});

selectDepartments.addEventListener("change", (event) => {
    departmentCode = event.target.value
})
loadRegions()

function loadCommunes() {
    fetch(`${baseUrl}/departements/${departmentCode}/communes`).then(response => {
        return response.json();
    }).then(communes => {
        communes.sort((a, b) => b.population - a.population);
        selectCommunes.innerHTML = ''
        communes.forEach(commune => {
            const li = document.createElement("li")
            li.textContent = `${commune.nom} (Population : ${commune.population || "Inconnue"})`;
            selectCommunes.appendChild(li)
        });

    })
}

communesButton.addEventListener("click", (event) => {
    loadCommunes()
})

//bonus 
function geoFindMe() {

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords
            fetch(`https://geo.api.gouv.fr/communes?lat=${latitude}&lon=${longitude}&fields=code,nom,codesPostaux,surface,population,centre,contour`).then(response => {
                return response.json();
            }).then(communes => {
                const commune = communes[0]
                result.innerHTML = `<h2> Localisation</h2>
                         <p>Ville: ${commune.nom}</p>
                           <p>Code postal: ${commune.codesPostaux[0]}</p>
                          <p>Population: ${commune.population}</p>
                            `

            })
        });


    } else {
        alert("no commune found")
    }
}

geo.addEventListener("click", geoFindMe)



