import { storageService } from './async-storage.service.js'

export const locService = {
    getLocs,
    getStroageKey,
    addPlace
}
const STORAGE_PLACES_KEY = 'placesDB'

const gPlaces = storageService._load(STORAGE_PLACES_KEY) || _createDemoPlace()


const locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

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


console.log('gPlaces', gPlaces);

function _createDemoPlace() {
    const place = {
        lat: 32,
        lng: 32,
        name: 'Home',
        time: '16/10/22, 13:01'
    }
    storageService.post(STORAGE_PLACES_KEY, place)
    return place
}


function _createPlace(loc) {
    storageService.post(STORAGE_PLACES_KEY, loc)
}

function addPlace(loc) {
    gPlaces.unshift(_createPlace(loc))
}
