import {
    locationService
} from './services/location-service.js'
// import {locationVars} from './services/location-service.js'

console.log('locationService', locationService);
// console.log('locationVars', locationVars);

var gGoogleMap;
var gPlaces = []

window.onload = () => {
    initMap()
        .then(() => {
            addMarker({
                lat: 32.0749831,
                lng: 34.9120554
            });
        })
        .catch(console.log('INIT MAP ERROR'));



    document.querySelector('.btn-local').addEventListener('click', (ev) => {
        console.log('Aha!', ev.target);
        getUserPosition()
            .then(pos => {
                console.log('User position is:', pos.coords);
                const userCoords = pos.coords
                panTo(userCoords.lat, userCoords.lng);
            })
            .catch(err => {
                console.log('err!!!', err);
            })
    })

    renderFavPlaces()
    renderSearchBtn()
}


export function initMap(lat = 32.0749831, lng = 34.9120554) {
    // console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            // console.log('google available');
            gGoogleMap = new google.maps.Map(
                document.querySelector('#map'), {
                    center: {
                        lat,
                        lng
                    },
                    zoom: 15
                })

            gGoogleMap.addListener('click', (ev) => {
                // console.log('Map clicked', ev);

                const placeName = prompt('Place name?')
                console.log('Map clicked', placeName, ev.latLng.lat(), ev.latLng.lng());
                var place = {
                    placeName,
                    lat: ev.latLng.lat(),
                    lng: ev.latLng.lng(),
                    dateCreated: Date.now()
                }
                addMarker(place)
                locationService.getLocalToSave(place)
                renderFavPlaces();
            });
        })
}

function renderSearchBtn(){
var strHTML = `<button onclick="searchLocation()">Go</button>`;
const elBtnSearch = document.querySelector('.btn-search');
elBtnSearch.innerHTML = strHTML
}

window.searchLocation = function() {
 const elAddress = document.querySelector('input[name=search-local]').value
 
//  JSON.parse({elAddress})
 console.log('elAddress',elAddress);
}

function renderFavPlaces() {
    const locations = locationService.getLocationsForDisplay();
    console.log('locations',locations);
    const strHTMLs = locations.map(function (place) {
        return ` <tr><td class="grid-item">${place.placeName}</td>
        <td><button class="btn-pan" onclick="panTo(${place.lat},${place.lng})">Go There</button></td>
        <td><button class="btn-delete" data-id="${place.placeName}">Delete</button></td>
        </tr>
        `
    })
    document.querySelector('.table').innerHTML = strHTMLs.join('');
    const elBtnsDelete = Array.from(document.querySelectorAll('.btn-delete'))
    elBtnsDelete.forEach(elBtn => {
        elBtn.addEventListener('click', ev => {
            const placeId = ev.target.dataset.id
            console.log('delete in:', placeId)
            locationService.deleteLocation(placeId)
        })
    })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gGoogleMap,
        title: 'Hello World!'
    });
    return marker;
}

window.panTo = function (lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gGoogleMap.panTo(laLatLng);
}


function getUserPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyBdCDiDS_3i_iD5FgOt5ixxFS9ZwJBsuyw';
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}