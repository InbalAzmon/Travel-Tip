
import {locationService} from './services/location-service.js'
// import {locationVars} from './services/location-service.js'

console.log('locationService', locationService);
// console.log('locationVars', locationVars);

var gGoogleMap;
var gPlaces = []

window.onload = () => {
    initMap()
        .then(() => {
            addMarker({ lat: 32.0749831, lng: 34.9120554 });
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
        // panTo(35.6895, 139.6917);
    })
}


export function initMap(lat = 32.0749831, lng = 34.9120554) {
    // console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            // console.log('google available');
            gGoogleMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            // console.log('Map!', gGoogleMap);

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

function renderFavPlaces(){
    const strHTMLs = gPlaces.map(function(place){
        return ` <tr><td>${place.placeName}</td>
        <td><button class="btn-pan" data-id="panTo(${place.lat},${place.lng})">Go There</button></td>
        <td><button class="btn-delete" data-id="${place.placeName}">Delete</button></td>
        </tr>
        `
    })
    document.querySelector('.table').innerHTML = strHTMLs.join('');
    const elBtnsDelete = Array.from(document.querySelectorAll('.btn-delete'))
    elBtnsDelete.forEach(elBtn => {
        elBtn.addEventListener('click',ev => {
            const placeId = ev.target.dataset.id
            console.log('delete in:',placeId)
            locationService.deleteLocation(placeId)
        })
    })
    const elBtnsPan= Array.from(document.querySelectorAll('.btn-pan'))
    elBtnsPan.forEach(elBtn => {
        elBtn.addEventListener('click', ev => {
            const placeLat = ev.target.dataset.lat
            const placeLng = ev.target.dataset.lng
            console.log('pan to:',placeLat ,'', placeLng);
            panTo(placeLat,placeLng)
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

function panTo(lat, lng) {
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



