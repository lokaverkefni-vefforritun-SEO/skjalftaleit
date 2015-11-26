// Variable for google map
var map;
// Variables for earthquake display on map
var markers = [];
var circles = [];
var heatmapping = {};

var mapData = module.exports;

mapData.dataInit = function(quakeArray) {
	createMarkers(quakeArray);
	createCircles(quakeArray);
	placeMarkers(markers);
	placeCircles(circles);
	console.log("Data parsed");
}

// Function for initializing map
function initMap() {
	console.log('er inní initMap');
	map = new google.maps.Map(document.getElementById('map'), {
		// Initialized with focus on Reykjavik coordinates
		center: {lat: 64.133, lng: -21.933},
		zoom: 5
	});
};

// Function for creating markers and placing in array
function createMarkers(arrayOfQuakes) {
	for(var i = 0; i < arrayOfQuakes.length; i++)
	{
		var marker = new google.maps.Marker({
			position : {lat: arrayOfQuakes[i].lat, lng: arrayOfQuakes[i].lng},
			title: 'marker number ' + i
		});
		marker['quake'] = arrayOfQuakes[i];
		markers.push(marker);
		console.log("Marker created");
	}
};

// Function for placing marker on map with given data
function placeMarkers(arrayOfMarkers) {
	for(var i = 0; i < arrayOfMarkers.length; i++)
	{
		arrayOfMarkers[i].setMap(map);
		console.log("Marker placed");
	}
};

// Function for attaching info windows to markers
function setMarkerInfo(markerArray) {
	for(var i = 0; i < markerArray.length; i++)
	{
		// Content for info box
		var contentString = '<div class="markerContent">' +
				'<p>' +
					'Latitude: ' + markerArray[i].quake.lat + '<br/>' +
					'Longitude: ' + markerArray[i].quake.lng + '<br/>' +
					'Magnitude: ' + markerArray[i].quake.strength + '<br/>' +
					'Date: ' + dayFromDateObject(markerArray[i].quake.time) + '<br/>' +
					'Time: ' + timeFromDateObject(markerArray[i].quake.time)
				+ '</p>'
			'</div>';

		// Creates info window
		var infowindow = new google.maps.InfoWindow({
			content: contentString
		});

		markerArray[i].infowindow = infowindow;
		attachMarkerListeners(i);
	}
}

// Function for adding event listeners to markers so they display
// info windows when clicked
function attachMarkerListeners(i) {
	google.maps.event.addListener(markers[i], 'click', function(){
		this.infowindow.open(map, this);
	});
}

// Function for opening info window when marker is clicked
function markerClicked() {
	return function() {
		markers[i].info.open(map, markers[i]);
	}
}

// Function for creating circles
function createCircles(arrayOfQuakes) {
	for(var i = 0; i < arrayOfQuakes.length; i++)
	{
		// Sets opacity with respect to Richter magnitude
		var opacity = arrayOfQuakes[i].strength / 10.0;
		if(opacity > 1.0) {opacity = 1.0}
		// Places overlay circles
		var circle = new google.maps.Circle({
			strokeColor: '#FF7700',
			strokeOpacity: opacity,
			strokeWeight: 2,
			fillColor: '#FF7700',
			fillOpacity: opacity,
			map: map,
			center: {lat: arrayOfQuakes[i].lat, lng: arrayOfQuakes[i].lng},
			radius: arrayOfQuakes[i].strength * 10000
		});
		circles.push(circle);
		console.log("Circle created");
	}
};

// Function for placing circle on map with given data
function placeCircles(arrayOfCircles) {
	for(var i = 0; i < arrayOfCircles.length; i++)
	{
		circles[i].setMap(map);
		console.log("Circle placed");
	}
};

// Function for creating heatmap points
function createHeatmapPoints(arrayOfQuakes) {
	var heatmapData = [];
	for(var i = 0; i < arrayOfQuakes.length; i++)
	{
		// LatLng object with coordinates to be placed in the weighted points
		var latLng = new google.maps.LatLng(arrayOfQuakes[i].lat, arrayOfQuakes[i].lng)
		// Object containing heatmap data with radius in accordance with magnitude
		tmpWeight = arrayOfQuakes[i].strength / 15;
		var weightedLocation = {
			location: latLng,
			weight: tmpWeight,
			radius: 1
		}
		heatmapData.push(weightedLocation);
	}
	// Takes all weighted points and places them on single heatmap layer
	var heatmapPoints = new google.maps.visualization.HeatmapLayer({
		data: heatmapData,
		dissipating: false,
	});
	heatmapping = heatmapPoints;
}

// Function for placing heatmap data on map
function placeHeatmapPoints(heatmapInput) {
	heatmapInput.setMap(map);
}


// Function for parsing Date object into custom string containing the day
function dayFromDateObject(dateObject)
{
	var stringToReturn = dateObject.getFullYear() + "/" +
	dateObject.getMonth() + "/" +
	dateObject.getDate();
	return stringToReturn;
}

// Function for parsing Date object into custom string containing time
function timeFromDateObject(dateObject)
{
	var stringToReturn = dateObject.getHours() + ":" +
	dateObject.getMinutes() + ":" +
	dateObject.getSeconds();
	return stringToReturn;
}
