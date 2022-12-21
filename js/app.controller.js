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

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
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
    renderPlaceList()
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
        lat: ev.latLng.lat(),
        lng: ev.latLng.lng(),
        time: createFormatedDate(Date.now())
    }
    locService.addPlace(location)
    // renderMarkers(gMap)
    // console.log('gMap', gMap);
    console.log('location', location);

}

function renderPlaceList() {
    return locService.getLocs().then(places => {
        console.log('places', places);

        const strHTML = places.map(place =>
            `
             <ul class="list-locs">
             <li>id: ${place.id}</li>
             <li>lat:${place.lat} </li>
             <li>lng: ${place.lng}</li>
             <li>time: ${place.time}</li>
             <div class="ul-btn-container"> 
             <button id="${place.id}" onclick="onGoTo(this.id)" class="btn-go-to">Go to</button>
             <button id="${place.id}" onclick="onDelete(this.id)" class="btn-del">Delete!</button>
             </div>
         </ul>
             `
        ).join('')
        const elLocs = document.querySelector('.locs')
        elLocs.innerHTML = strHTML

    })

}

function onGoTo(id) {
    console.log('id', id);


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