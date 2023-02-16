console.log("Are we there yet?");

let latitude = 38.89814;
let longitude = -77.029446;
let distance = "8207m";
let address = "1600%20Pennsylvania%20Ave%20NW";
let theToken = "pk.eyJ1IjoiYnJvd25leWVzMzAzIiwiYSI6ImNsMmo5Y3J2cjBvMXEzYnJ6enFvcG1ic3MifQ.mtAx1S1i-0FkMY3KBQDKXQ";
let theURL = `https://trackapi.nutritionix.com/v2/locations?ll=${latitude},${longitude}&distance=${distance}&limit=5`;
let addyURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${theToken}`;
let map = L.map('map').setView([latitude, longitude], 13);
let theDemo = document.getElementById("demo");
const theInput = document.querySelector("#the-input");
const searchButton = document.querySelector(".button");
const currentLoc = document.querySelector(".current-loc");
const theCardArea = document.querySelector(".cardarea");

console.log(searchButton);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


let marker = L.marker([latitude, longitude]).addTo(map);

let circle = L.circle([latitude, longitude], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map);

// let polygon = L.polygon([
//     [51.509, -0.08],
//     [51.503, -0.06],
//     [51.51, -0.047]
// ]).addTo(map);

let popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);

async function postAddy(url){
    let response = await fetch(url);
    response = await response.json();
    console.log(response);
    long = response.features[0].center[0];
    console.log(long);
    lat = response.features[0].center[1];
    console.log(lat);
    showPositionFromAddy(lat, long);
}

function showPositionFromAddy(latitude, longitude) {
    console.log(latitude);
    console.log(longitude);
    map.setView(new L.LatLng(latitude, longitude), 13);
    marker = L.marker([latitude, longitude]).addTo(map);
    circle = L.circle([latitude, longitude], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500
    }).addTo(map);
    theURL = `https://trackapi.nutritionix.com/v2/locations?ll=${latitude},${longitude}&distance=${distance}&limit=5`;
    postData(theURL);
    console.log(theURL);
}

async function postData(url, data = {}){
    let response = await fetch(url, {
        method: 'GET',
        headers: {
            "x-app-id": "10d20a5d",
            "x-app-key": "a226dce7a902c0934ea83c60fbd6b4ff"
        }
    });
    response = await response.json();
    console.log("We're definitely here");
    console.log(response);
    console.log("url", url);
    for(let i = 0; i < response.locations.length; i++){
        let theName = document.createElement("p");
        theName.className = "name";
        let theAddress = document.createElement("p");
        theAddress.className = "address";
        let theCity = document.createElement("p");
        theCity.className = "city-info";
        let theNumber = document.createElement("p");
        theNumber.className = "phone-number";
        let theWebsite = document.createElement("a");
        theWebsite.href = response.locations[i].website;
        theWebsite.target = "_blank";
        let theCard = document.createElement("div");
        theCard.className = "card";
        let theContainer = document.createElement("div");
        theContainer.className = "container";
        theCardArea.append(theCard);
        theCard.append(theContainer);
        theContainer.append(theName);
        theContainer.append(theAddress);
        theContainer.append(theCity);
        theContainer.append(theNumber);
        theContainer.append(theWebsite);
        theName.innerText = response.locations[i].name;
        theAddress.innerText = response.locations[i].address;
        theCity.innerText = `${response.locations[i].city}, ${response.locations[i].state} ${response.locations[i].zip}`;
        theNumber.innerText = response.locations[i].phone;
        theWebsite.innerText = `${response.locations[i].name} website`;
        console.log(response.locations[i]);
    }
}

function getLocation() {
    console.log("arrived");
    console.log(navigator);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        theDemo.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);
    map.setView(new L.LatLng(position.coords.latitude, position.coords.longitude), 13);
    marker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);
    circle = L.circle([position.coords.latitude, position.coords.longitude], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500
    }).addTo(map);
    theURL = `https://trackapi.nutritionix.com/v2/locations?ll=${position.coords.latitude},${position.coords.longitude}&distance=${distance}&limit=5`;
    postData(theURL);
    console.log(theURL);
}

function Remove(){
    while(theCardArea.firstChild){
        theCardArea.removeChild(theCardArea.lastChild);
    }
}

currentLoc.addEventListener("click", function(event){
    event.preventDefault();
    Remove();
    getLocation();
});

function ChangeAddress(word){
    let res = "";
    for(let letter of word){
        if(letter == " "){
            res += "%20";
        }
        else{
            res += letter;
        }
    }
    return res;
}

searchButton.addEventListener("click", function(event){
    event.preventDefault();
    if(theInput.value == ""){
        alert("Please enter a city, zip code or address.");
    }
    else{
        address = theInput.value;
        address = ChangeAddress(address);
        addyURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${theToken}`;
        console.log(theInput.value);
        Remove();
        postAddy(addyURL);
    }
});
