// Obejct array for cities
var cities = [];

// variables 
var cityFormEl = document.querySelector("#city-search-form");
var cityInputEl = document.querySelector("#city");
var citySearchInputEl = document.querySelector("#searched-city");
var weatherContainerEl = document.querySelector("#current-weather-container");
var forecastTitleEl = document.querySelector("#forecast");
var forecastContainerEl = document.querySelector("#five-day-container");
var pastSearchButtonEl = document.querySelector("#past-search-buttons") 


// formSubmitHandler function
var formSubmitHandler = function(event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();
    if(city) {
        getCityWeather(city);
        getFiveDay(city);
        cities.unshift({city});
        cityInputEl.value = "";
    } else {
        alert("Please enter a City");
    }
    saveSearch();
    pastSearch(city);
    console.log(city);
};

// saveSearch function
var saveSearch = function() {
    localStorage.setItem("cities", JSON.stringify(cities));
};

// getCityWeather function
var getWeather = function () {
    var apiKey =  "f3c6f7687f7f43a162f3912305630533"
    var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={apiKey}'

    // make a request to the url for call back
    fetch(apiUrl)
    .then(function(response) {
        response.json().then(function(data) {
            displayWeather(data, city);
            console.log(response);
        });
    });
};
// displayWeather function
var displayWeather = function(weather, searchCity) {
    // clear old content
    weatherContainerEl.textContent= "";
    citySearchInputEl.textContent=searchCity;

    console.log(weather);

    // create date element
    var currentDate = document.createElement("span")
    currentDate.textContent=" (' + moment(weather.dt.value).format('MMMM Do YYYY, h:mm:ss a') + ') ";
    citySearchInputEl.appendChild(currentDate);
};
// getUvIndex function
// displayUvIndex function
// getFiveDay function
// displayFiveDay function
// pastSearch function
// pastSeachHandler function  





