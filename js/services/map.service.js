import { storageService } from './async-storage.service.js'



export const mapService = {
    initMap,
    addMarker,
    panTo,
    queryPlaces,
    getPlace,
    removePlace,
    savePlace
}


// Var that is used throughout this Module (not global)
var gMap
const STORAGE_PLACES_KEY = 'placesDB'

const gPlaces = localService.load(STORAGE_PLACES_KEY) || _createPlaces()

console.log('gPlaces', gPlaces);


function _createPlaces() {
    const places = [{
        id: util.makeId(),
        lat: 32,
        lng: 32,
        name: 'Home',
        time: '16/10/22, 13:01'
    }, {
        id: util.makeId(),
        lat: 55,
        lng: 55,
        name: 'Burekas Haagala',
        time: '16/10/22, 13:01'
    }, {
        id: util.makeId(),
        lat: 11,
        lng: 11,
        name: 'savta',
        time: '16/10/22, 13:01'
    }]
    localService.save(STORAGE_PLACES_KEY, places)
    return places

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

function _createPlace(loc) {



}


function addPlace(loc) {

    gPlaces.unshift(_createPlace(loc))
    localService.save(STORAGE_PLACES_KEY, gPlaces)


}





function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap')
    return _connectGoogleApi()
        .then(() => {
            console.log('google available')
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            console.log('Map!', gMap)
            gMap.addListener("click", onAddPlace)
        })

}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    })
    return marker
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyBlbVbvWFhmMwFiVvbSeax1Af8UpghJ6CY' //TODO: Enter your API Key
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}