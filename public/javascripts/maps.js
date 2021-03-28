
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/satellite-v9', // style URL
    center: restaurant.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());


new mapboxgl.Marker()
    .setLngLat(restaurant.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset:25})
        .setHTML(
            `<h3>${restaurant.title}</h3><p>${restaurant.location}`
        )
    )
    .addTo(map)


var about_btn = document.getElementById("toggle");
var btn = document.getElementById("details");
function hide(){
    about_btn.style.display = "none";
    btn.innerHTML = "Show Details";
}
function show(){
    about_btn.style.display = "block";
    btn.innerHTML = "Hide Details";
}

var count = 0;

function toggle(){
    if(count%2==0){
        count++;
        hide();
    }
    else{
        count++;
        show();
    }
}
function load(){
    toggle();
}
window.onload = load();