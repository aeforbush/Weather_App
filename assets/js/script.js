var citiesArr = [];

var cityInputEl = document.querySelector("#city");
var cityBtn = document.querySelector("#btn");
var cityNameEl = document.querySelector("#searched-city")
var apiKey = 'f3c6f7687f7f43a162f3912305630533'
var apiUrl = ''
let log = console.log;

var formHandler = function(event) {
    log(event);
    // get city name 
    var searchedCity = cityInputEl.nodeValue.trim();

    if (searchedCity) {
        getLocCoords(searchedCity);
        cityInputEl.value = "";
    } else {
        alert("Please enter a city!");
    };
};

// getcityName

// get currentForecast with API
var getCurrentForecast = function() {
    fetch()
}

// display currentForecast

// get fiveDay 

// display fiveDay

// no lat lon