//-------------------------1. osa Ostukorv ------------------------suurendaArtikkel

"use strict";
//toote pealt vajaliku info kogumine ja lisamine ostukorvi
let korv = [];
let tarneHind = 0;
const korviSisu = document.querySelector(".korv");
const lisaKorviNupud = document.querySelectorAll('[data-action="lisa_korvi"]');
lisaKorviNupud.forEach(lisaKorviNupp => {
    lisaKorviNupp.addEventListener('click', () => {
        const toodeInfo = lisaKorviNupp.parentNode;
        const toode = {
            nimi: toodeInfo.querySelector(".toode_nimi").innerText,
            hind: toodeInfo.querySelector(".toode_hind").innerText,
            kogus: 1
        };
        const onKorvis = (korv.filter(korvArtikkel => (korvArtikkel.nimi === toode.nimi)).length > 0);
        if (!onKorvis) {
            lisaArtikkel(toode); // selle funktsiooni loome allpool
            korv.push(toode);
            nupuOhjamine(lisaKorviNupp, toode); // selle funktsiooni loome allpool
            arvutaKokku();
        }
    });
});

//funktsioon toote lisamiseks
function lisaArtikkel(toode) {
    korviSisu.insertAdjacentHTML('beforeend', `
    <div class="korv_artikkel">
      <h3 class="korv_artikkel_nimi">${toode.nimi}</h3>
      <h3 class="korv_artikkel_hind">${toode.hind}</h3>    
      <div class="korv_artikkel_buttons">  
      <button class="btn-small" data-action="vahenda_artikkel">&minus;</button>
      <h3 class="korv_artikkel_kogus">${toode.kogus}</h3>
      <button class="btn btn-small" data-action="suurenda_artikkel">&plus;</button>
      <button class="btn btn-small" data-action="eemalda_artikkel">&times;</button>
      </div>
    </div>
  `);

    lisaKorviJalus(); // selle funktsiooni lisame allpool
}

//funktsioon nupu sündmusekuulutaja jaoks
function nupuOhjamine(lisaKorviNupp, toode) {
    lisaKorviNupp.innerText = 'Ostukorvis';
    lisaKorviNupp.disabled = true;

    const korvArtiklidD = korviSisu.querySelectorAll('.korv_artikkel');
    korvArtiklidD.forEach(korvArtikkelD => {
        if (korvArtikkelD.querySelector('.korv_artikkel_nimi').innerText === toode.nimi) {
            korvArtikkelD.querySelector('[data-action="suurenda_artikkel"]').addEventListener('click', () => suurendaArtikkel(toode, korvArtikkelD));
            korvArtikkelD.querySelector('[data-action="vahenda_artikkel"]').addEventListener('click', () => vahendaArtikkel(toode, korvArtikkelD, lisaKorviNupp));
            korvArtikkelD.querySelector('[data-action="eemalda_artikkel"]').addEventListener('click', () => eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp));
        }
    });
}

//toodete arvu suurendamine
function suurendaArtikkel(toode, korvArtikkelD) {
    korv.forEach(korvArtikkel => {
        if (korvArtikkel.nimi === toode.nimi) {
            korvArtikkelD.querySelector('.korv_artikkel_kogus').innerText = ++korvArtikkel.kogus;

        }
    });
    arvutaKokku();
}

//Ülesanne 5.1: lisa funktsioon toodete hulga vähendamiseks.
function vahendaArtikkel(toode, korvArtikkelD, lisaKorviNupp) {
    korv.forEach(korvArtikkel => {
        if (korvArtikkel.nimi === toode.nimi) {
            if (korvArtikkel.kogus > 1) {
                korvArtikkelD.querySelector('.korv_artikkel_kogus').innerText = --korvArtikkel.kogus;
                arvutaKokku();
            } else {
                eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp);
            }
        }
    });
}

//toodete eemaldamine ostukorvist
function eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp) {
    korvArtikkelD.remove();
    korv = korv.filter(korvArtikkel => korvArtikkel.nimi !== toode.nimi);
    lisaKorviNupp.innerText = 'Lisa ostukorvi';
    lisaKorviNupp.disabled = false;
    if (korv.length < 1) {
        document.querySelector('.korv-jalus').remove();
    }
    arvutaKokku();
}

//ostukorvi jaluse ehk alumiste nuppude lisamine
function lisaKorviJalus() {
    if (document.querySelector('.korv-jalus') === null) {
        korviSisu.insertAdjacentHTML('afterend', `
      <div class="korv-jalus">
        <button class="btn" data-action="tyhjenda_korv">Tühjenda ostukorv</button>
        <h3>Kokku: <span id="kokku_summa">0</span> €</h3>
        <button class="btn" data-action="kassa">Maksma</button>
      </div>
    `);
        document.querySelector('[data-action="tyhjenda_korv"]').addEventListener('click', () => tuhjendaKorv());
        document.querySelector('[data-action="kassa"]').addEventListener('click', () => kassa());
    }
}

// ostukorvi tühjendamine
function tuhjendaKorv() {
    korviSisu.querySelectorAll('.korv_artikkel').forEach(korvArtikkelD => {
        korvArtikkelD.remove();
    });

    korv = [];
    document.querySelector('.korv-jalus').remove();

    lisaKorviNupud.forEach(lisaOstukorviNupp => {
        lisaOstukorviNupp.innerText = 'Lisa ostukorvi';
        lisaOstukorviNupp.disabled = false;
    });
}


//Ülesanne 5.2: lisa funktsioon, mis arvutab ostukorvi summa kokku.
function arvutaKokku() {
    let summa = 0;
    korv.forEach(korvArtikkel => {
        summa = summa + korvArtikkel.hind * korvArtikkel.kogus;
    });
    const kokkuElement = document.getElementById("kokku_summa");
    if (kokkuElement !== null) {
        kokkuElement.innerText = summa + tarneHind; // tarneHind on 0, kuni tarneviis on valitud
    }
}

//Maksma nupp käivitab taimeri
function kassa() {
    alustaTaimer(60 * 2, document.getElementById("time"));
}


//-------------------------2. osa Taimer ------------------------

//taimer
let taimeriId;
function alustaTaimer(kestvus, kuva) {
    clearInterval(taimeriId); // et Maksma korduval vajutamisel ei jookseks mitu taimerit
    let start = Date.now(),
        vahe,
        minutid,
        sekundid;

    function taimer() {
        let vahe = kestvus - Math.floor((Date.now() - start) / 1000);

        let minutid = Math.floor(vahe / 60);
        let sekundid = Math.floor(vahe % 60);

        if (minutid < 10) {
            minutid = "0" + minutid;
        }
        if (sekundid < 10) {
            sekundid = "0" + sekundid;
        }

        kuva.textContent = minutid + ":" + sekundid;

        if (vahe < 0) {
            clearInterval(taimeriId);
            document.getElementById("time").innerHTML = "alusta uuesti";
        };
    };
    taimer();
    taimeriId = setInterval(taimer, 1000);

};

/* taimer ei käivitu enam lehe avamisel, vaid Maksma nupul (vt funktsioon kassa)
window.onload = function () {
    let taimeriAeg = 60 * 2,
        kuva = document.getElementById("time");
    alustaTaimer(taimeriAeg, kuva);
}; */


//-------------------------3. osa Tarne vorm ------------------------

const form = document.querySelector("form");
const eesnimi = document.getElementById("eesnimi");
const perenimi = document.getElementById("perenimi");
const telefon = document.getElementById("telefon");
const kinnitus = document.getElementById("kinnitus");
const tarne1 = document.getElementById("tarne1");
const tarne2 = document.getElementById("tarne2");

const errorMessage = document.getElementById("errorMessage");

// minu kood
const indeks = document.getElementById("indeks");

//boonus: tarne hind
tarne1.addEventListener('click', () => {
    tarneHind = 4;
    arvutaKokku();
});
tarne2.addEventListener('click', () => {
    tarneHind = 0;
    arvutaKokku();
});

//kontrollib, kas tekstis on number
function onNumbreid(tekst) {
    for (let i = 0; i < tekst.length; i++) {
        if (tekst[i] >= "0" && tekst[i] <= "9") {
            return true;
        }
    }
    return false;
}

//kontrollib, kas tekst koosneb ainult numbritest
function ainultNumbrid(tekst) {
    for (let i = 0; i < tekst.length; i++) {
        if (tekst[i] < "0" || tekst[i] > "9") {
            return false;
        }
    }
    return true;
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const errors = [];

    if (eesnimi.value.trim() === "") {
        errors.push("Sisesta eesnimi")
    }
    else if (onNumbreid(eesnimi.value)) {
        errors.push("Eesnimes ei tohi olla numbreid");
    }

    if (perenimi.value.trim() === "") {
        errors.push("Sisesta perenimi")
    }
    else if (onNumbreid(perenimi.value)) {
        errors.push("Perenimes ei tohi olla numbreid");
    }

    if (telefon.value.trim().length < 6 || !ainultNumbrid(telefon.value.trim())) {
        errors.push("Telefon peab olema vähemalt 6 numbrit ja sisaldama ainult numbreid");
    }

    // minu kood
    if (indeks.value.trim().length !== 5 || !ainultNumbrid(indeks.value.trim())) {
        errors.push("Postiindeks peab olema 5 numbrit");
    }

    if (!tarne1.checked && !tarne2.checked) {
        errors.push("Vali tarneviis");
    }

    if (!kinnitus.checked) {
        errors.push("Palun nõustu tingimustega");
    }

    if (errors.length > 0) {
        e.preventDefault();
        errorMessage.innerHTML = errors.join(', ');
    }
    else {
        errorMessage.innerHTML = "";

    }

})

/* Ülesanne 5.3: täienda vormi sisendi kontrolli:
- eesnime ja perenime väljal ei tohi olla numbreid;
- telefoni väli ei tohi olla lühem kui 6 sümbolit ning peab sisaldama ainult numbreid;
- üks raadionuppudest peab olema valitud;
- lisa oma valikul üks lisaväli ning sellele kontroll. Märgi see nii HTML kui JavaScripti
  koodis "minu kood" kommentaariga. */



