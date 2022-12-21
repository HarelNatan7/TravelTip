import { storageService } from './async-storage.service.js'

export const locService = {
    getLocs,
    getStorageKey,
    addPlace,
    queryPlaces,
    getPlace,
    removePlace,
    savePlace,
    getCurrLocation,
    deleteLoc,
}
const STORAGE_PLACES_KEY = 'placesDB'

let locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384, time: '12/21/2022, 19:31' },
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581, time: '02/28/2022, 09:01' }
]
_createDemoPlaces()

function deleteLoc(id) {
    return storageService.remove(STORAGE_PLACES_KEY, id).then(res => {
        locs = storageService._load(STORAGE_PLACES_KEY)
        return res
    })
}

function getCurrLocation(id) {
    return storageService.get(STORAGE_PLACES_KEY, id).then(res => {
        return res
    })
}

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs)
        }, 2000)
    })
}

function getStorageKey() {
    return STORAGE_PLACES_KEY
}

function _createDemoPlaces() {
    if (storageService._load(STORAGE_PLACES_KEY)) {
        locs = storageService._load(STORAGE_PLACES_KEY)
        return
    }
    getLocs().then(locs => {
        storageService.post(STORAGE_PLACES_KEY, locs[0])
        setTimeout(() => {
            storageService.post(STORAGE_PLACES_KEY, locs[1])
        }, 1000);
    })
}

function addPlace(loc) {
    storageService.post(STORAGE_PLACES_KEY, loc).then(loc => {
        locs.unshift(loc)
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


