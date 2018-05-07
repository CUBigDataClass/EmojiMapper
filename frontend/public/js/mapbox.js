
  mapboxgl.accessToken = 'pk.eyJ1IjoicHJhc2hpbGJoaW1hbmkiLCJhIjoiY2pndTBxajRqMWp1ZjJ3bWw4MWFlZmhidCJ9.YbLFXYlIM7grVxW5Hvavxw';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [96, 37.8],
    zoom: 3
  });
 

function mapLoad(){

$.ajax({
    type: "GET",
    url: "/map/"+document.getElementById("mapbox").getAttribute('trend')+"/"+document.getElementById("mapbox").getAttribute('date'),              
    dataType: "json",
    error: function (response) {           
      alert('Error: There was a problem processing your request, please refresh the browser and try again');
    },
    success: function (response) {
      response.forEach(function(a){
        var el = document.createElement('div');
        if(a.hasEmoji==true){
          el.className="marker";
        }else{
        el.className = 'NEmarker';
        }
         new mapboxgl.Marker(el)
        .setLngLat(a.location)
        .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML('<h3>' + a.tweet + '</h3><h3>'+a.listEmoji+'</h3>'))
        .addTo(map);
      })  
    }
  });
}
window.setInterval("mapLoad()", 5000);
