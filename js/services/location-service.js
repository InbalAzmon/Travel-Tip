
export const locationService = {
    getLocations,
    deleteLocation,
    getLocalToSave,
    getLocationsForDisplay
}

// export const locationVars = {
//     PLACES,
//     gPlaces
// }


const PLACES = 'places';

const  gLocations = [];


function getLocalToSave(place){
    console.log('entered getLocalToSave');
    gLocations.push(place)
  
    saveToStorage(PLACES,gLocations)
}

function getLocations() {
    return Promise.resolve(gLocations)
}

function getLocationsForDisplay(){
    const locations = loadFromStorage(PLACES);
    return locations;
}

function deleteLocation(placeName) {
    var placeIdx = gLocations.findIndex((place) => {
        return placeName === place.placeName;
    });
    if(placeIdx === -1) return;

    gLocations.splice(placeIdx, 1);
    saveToStorage(PLACES, gLocations);
}

function loadFromStorage(key) {
    var json = localStorage.getItem(key)
    var value = JSON.parse(json)
    return value;
}

function saveToStorage(key, value) {
    console.log('saving to storage');
    var json = JSON.stringify(value);
    localStorage.setItem(key, json)
}
