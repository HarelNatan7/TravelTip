import { storageService } from './async-storage.service.js'

export const locService = {
    getLocs,
    getStroageKey,
    addPlace,
    queryPlaces,
    getPlace,
    removePlace,
    savePlace,
}
const STORAGE_PLACES_KEY = 'placesDB'

let locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384, },
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581, }
]
_createDemoPlaces()


function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs)
        }, 2000)
    })
}

function getStroageKey() {
    return STORAGE_PLACES_KEY
}


function _createDemoPlaces() {
    if (storageService._load(STORAGE_PLACES_KEY)) {
        locs = storageService._load(STORAGE_PLACES_KEY)
        return
    }
    getLocs().then(locs => {
        console.log('locs', locs);

        storageService.post(STORAGE_PLACES_KEY, locs[0])
        setTimeout(() => {
            storageService.post(STORAGE_PLACES_KEY, locs[1])
        }, 1000);
    })


}



function addPlace(loc) {
    storageService.post(STORAGE_PLACES_KEY, loc).then(loc => {
        console.log('loc', loc);
        locs.unshift(loc)

        console.log('locs', locs);
    })

}




function queryPlaces() {
    return storageService.query(STORAGE_PLACES_KEY)
        .then(places => {
            return places
        })
}

function getPlace(placeId) {
    return storageService.get(STORAGE_PLACES_KEY, placeId)
}

function removePlace(placeId) {
    return storageService.remove(STORAGE_PLACES_KEY, placeId)
}

function savePlace(place) {
    if (place.id) {
        return storageService.put(STORAGE_PLACES_KEY, place)
    } else {
        return storageService.post(STORAGE_PLACES_KEY, place)
    }
}