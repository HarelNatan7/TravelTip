import { storageService } from './async-storage.service.js'



export const mapService = {
    initMap,
    addMarker,
    panTo,
    addPlace
}


// Var that is used throughout this Module (not global)
var gMap
const STORAGE_PLACES_KEY = 'placesDB'

const gPlaces = storageService._load(STORAGE_PLACES_KEY) || _createDemoPlace()

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