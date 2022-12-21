import { storageService } from './async-storage.service.js'

export const mapService = {
    initMap,
    addMarker,
    panTo,
    goToUserLocation,
    goToSearchedLocation,
    queryParams,
    getWeather
}

var gMap

function goToUserLocation(lat, lng) {
    initMap(lat, lng)
}

function initMap(lat = 32.0749831, lng = 34.9120554) {
    return _connectGoogleApi()
        .then(() => {
            console.log('google available')
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 12
            })
            gMap.addListener("click", onAddPlace)
        })
}

function getWeather(lat, lan) {
    const WeAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lan}&appid=dfc218ff46f1927e47993f84a5372d8f`
    return axios.get(WeAPI).then(res => {
        res = res.data
        // console.log('res:', res)
        // console.log('res.weather[0].main:', res.weather[0].main)
        // console.log('res.main.temp:', res.main.temp)
        let weather = res.weather[0].main
        let temps = res.main.temp
        let locationWeather = {
            weather,
            temps
        }
        // console.log('locationWeather:', locationWeather)
        return locationWeather
    })
}

function queryParams(res) {
    const queryStringParams = `?lat=${res.lat}&lng=${res.lng}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}


function addMarker(loc) {
    let iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        icon: iconBase + 'library_maps.png',
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

function goToSearchedLocation(locationName) {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=1600+${locationName}&key=AIzaSyBlbVbvWFhmMwFiVvbSeax1Af8UpghJ6CY`).then(res => {
        let location = res.data.results[0].geometry.location
        initMap(location.lat, location.lng)
    })
}
