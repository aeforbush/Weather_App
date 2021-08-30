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
}

// saveSearch function
var saveSearch = function() {
    localStorage.setItem("cities", JSON.stringify(cities));
}

// getCityWeather function
var getWeather = function () {
    // var apiKey =  'f3c6f7687f7f43a162f3912305630533';
    var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=f3c6f7687f7f43a162f3912305630533';

    // make a request to the url for call back
    fetch(apiUrl)
    .then(function(response) {
        response.json().then(function(data) {
            displayWeather(data, city);
            // console.log(data);
        })
        .catch(function() {
            // catch any errors
        })
    });
    getWeather();
}

// displayWeather function
var displayWeather = function(weather, searchCity) {
    // clear old content
    weatherContainerEl.textContent= "";
    citySearchInputEl.textContent=searchCity;

    //console.log(weather);

    // create date element
    var currentDate = document.createElement("span")
    currentDate.textContent=" (' + moment(weather.dt.value).format('MMMM Do YYYY, h:mm:ss a') + ') ";
    citySearchInputEl.appendChild(currentDate);

    // create an image element
    var weatherIcon = document.createElement("img")
    weatherIcon.setAttribute("icon").scr = 'http://openweathermap.org/img/wn/10d@2x/${d.weather[0].icon}.png';
    citySearchInputEl.appendChild(weatherIcon);
    //console.log(weatherIcon);

    // create span to hold temperature
    var temperature = document.createElement("span")
    temperature.textContent = "Temperature: " + weather.main.temp + " °F";
    temperature.classList = "list-group-item"

    // create span to hold humidity
    var humidity = document.createElement("span")
    humidity.textContent = "Humidity: " + weather.main.humidity + " %";
    humidity.classList = "list-group-item"

    // create span to hold wind speed
    var windSpeed = document.createElement("span")
    windSpeed.textContent = "Wind Speed: " + weather.main.speed + " MPH";
    windSpeed.classList = "list-group-item"

    // append to container
    weatherContainerEl.appendChild(temperature);
    weatherContainerEl.appendChild(humidity);
    weatherContainerEl.appendChild(windSpeed);

}



// getUvIndex function
/*var getUvIndex = function() {
    var apiUrl = ''
}*/
// displayUvIndex function
// getFiveDay function
// displayFiveDay function
// pastSearch function
// pastSeachHandler function  

/*window.onload = function () {
    getWeather();
}*/



