import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'


window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onAddPlace = onAddPlace
window.onUserLocation = onUserLocation
window.onSearchLocation = onSearchLocation
window.onGoTo = onGoTo
window.onDelete = onDelete
window.renderParams = renderParams

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
            renderPlaceList()
            renderParams()
        })
        .catch(() => console.log('Error: cannot init map'))

}

function onSearchLocation() {
    let locationName = document.getElementById('search').value
    mapService.goToSearchedLocation(locationName)
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker')
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2)
        })

}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords)
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}
function onPanTo() {
    console.log('Panning the Map')
    mapService.panTo(35.6895, 139.6917)
}

function onAddPlace(ev) {
    const location = {
        name: prompt('Location name ?'),
        lat: ev.latLng.lat(),
        lng: ev.latLng.lng(),
        time: createFormatedDate(Date.now())
    }

    console.log('locationlt',);
    console.log('locationlng', location.lng);

    mapService.queryParams({ lat: location.lat, lng: location.lng })
    locService.addPlace(location)
    // renderMarkers(gMap)
    // console.log('gMap', gMap);
    console.log('location', location);
    renderPlaceList()
}

function renderPlaceList() {
    return locService.getLocs().then(places => {
        console.log('places', places);

        const strHTML = places.map(place =>
            `
             <ul class="location">
             <li>Name: ${place.name}</li>
             <li>Created At: ${place.time}</li>
             <div class="ul-btn-container"> 
             <button class="location-btn" id="${place.id}" onclick="onGoTo(this.id)">Go to</button>
             <button class="location-btn" id="${place.id}" onclick="onDelete(this.id)">Delete</button>
             </div>
         </ul>
             `
        ).join('')
        const elLocs = document.querySelector('.locations')
        elLocs.innerHTML = strHTML

    })

}

function renderParams() {
    let params = new URLSearchParams(window.location.search)
    console.log('params', params);
    let lat = params.getAll('lat')
    let lng = params.getAll('lng')
    let queryLat = lat.toString()
    let queryLng = lng.toString()
    locService.getWeather(queryLat, queryLng).then(res => renderWeather(res))
    mapService.initMap(+queryLat, +queryLng)
}

function renderWeather(locationWeather) {
    const elTemps = document.querySelector('.temps-container')
    let strHTML = `
            <span class="status">${locationWeather.weather}</span>
            <span class="temps">${Math.floor(locationWeather.temps / 19)}°C</span>
`
elTemps.innerHTML = strHTML
}

function onDelete(id) {
    locService.deleteLoc(id)
    renderPlaceList()
}


function onGoTo(id) {
    locService.getCurrLocation(id).then(res => {
        mapService.queryParams(res)
        // renderFilterByQueryStringParams()
        return mapService.initMap(res.lat, res.lng)
    })
}




function createFormatedDate(date) {
    const formatedDate = new Intl.DateTimeFormat('en').format(date)
    const options = {
        hour: '2-digit',
        minute: '2-digit'
    }
    const formatedTime = new Intl.DateTimeFormat('he', options).format(date)
    return formatedDate + ', ' + formatedTime
}


function onUserLocation() {
    getPosition()
        .then(pos => mapService.goToUserLocation(pos.coords.latitude, pos.coords.longitude))
}