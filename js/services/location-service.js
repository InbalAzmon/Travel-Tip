
export const locationService = {
    getLocations,
    saveToStorage,
    loadFromStorage,
}

// export const locationVars = {
//     PLACES,
//     gPlaces
// }


// const PLACES = 'places';
// var gPlaces = [];
const  gLocations = [{lat: 17, lng: 19, name: 'Puki Home'}];


function getLocations() {
    return Promise.resolve(gLocations)
}

function loadFromStorage(key) {
    var json = localStorage.getItem(key)
    var value = JSON.parse(json)
    return value;
}

function saveToStorage(key, value) {
    var json = JSON.stringify(value);
    localStorage.setItem(key, json)
}
