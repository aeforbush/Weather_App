var citiesArr = [];

var cityInput = document.getElementById("#city-input");
var cityBtn = document.getElementById("#search-btn");
var cityName = document.getElementById("#city-name")
var apiKey = 'f3c6f7687f7f43a162f3912305630533'
let log = console.log;

var formHandler = function() {
    //log(event);
    // get city name 
    var searchedCity = cityInput
    .value
    .trim()

    if (searchedCity) {
        getCityForecast(searchedCity);
        //log(searchedCity);
        cityInput.value = "";
    } else {
        alert("Please enter a city!");
    };
};


// get currentForecast using city name with API 
var getCurrentForecast = function(city) {
    var CurrentWeatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    fetch(currentWeatherApi).then(function(response) {
        if (response) {
            response.json().then(function(data) {
                getCityForecast(city);


                saveCity(city);
                loadCities();
            });
        } else {
            alert(`Error: ${response.statusText}`)
        }
    })
    .catch(function(error) {
        alert('Unable to load weather.');
    })
}


// uses city name to fetch current weather and five day forecast

var getCityForecast = function(city) {
    //log(city);
    var apiCall = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    log(city);
    fetch(apiCall).then(function(response) {
       
        if (response) {
            response.json().then(function(data) {

                // identifies city name in forecast
                cityName.textContent = `${city} (${moment().format("M/D/YYYY")})`;
            
                //log(data);
                currentForecast(data);
                fiveDayForecast(data);

            });
        }
    })
}




// helper function to select HTML element and display rounded temperature
var displayTemp = function(element, temperature) {
    var tempEl = document.getElementById(element);
    var elementText = Math.round(temperature);
    tempEl.textContent = elementText;
}

// display currentForecast

var currentForecast = function(forecast) {

    var forecasteEl = document.getElementById('#city-forecast');
    forecasteEl.textContent = elementText;

    var weatherIconEl = document.getElementById('#today-icon');
    var currentIcon = forecast.weather[0].icon;
    weatherIconEl.setAttribute('src', `http://openweathermap.org/img/wn/${currentIcon}.png`);
    weatherIconEl.setAttribute('alt', forecast.weather[0].main)

    displayTemp('#current-temp', forecast.current['temp']);
    displayTemp('#current-real-feel', forecast.current['feels_like']);
    displayTemp('#current-high', forecast.daily[0].temp.max);
    displayTemp('#current-low', forecast.daily[0].temp.min);

    var currentConditionEl = document.getElementById('#current-condition');
    currentConditionEl.textContent = forecast.weather[0].description
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');

    var currentHumidityEl = document.getElementById('#current-humidity');
    currentHumidityEl.textContent = forecast.current['humidity'];

    var currentWindEl = document.getElementById('#current-wind-speed');
    currentWindEl.textContent = forecast.current['wind-speed'];

    var UvEl = document.getElementById('#current-uv');
    var currentUv = forecast.current['uv'];
    UvEl.textcontent = currentUv;
}

// display fiveDay
var fiveDayForecast = function(forecast) {
    for (var i = 0; i < 6; i++) {
        var dateP = document.getElementById('#date-' + i);
        dateP.textContent = moment().add(i, 'days').format('M/D/YYYY');

        var iconImg = document.getElementById('#icon-' + i);
        var iconCode = forecast.daily[i].weather[0].icon;
        iconImg.setAttribute('scr', `http://openweathermap.org/img/wn/${iconCode}.png`);

        displayTemp('#temp-' + i, forecast.daily[i].temp.day);

        var humiditySpan = document.getElementById('#humidty-' + i);
        humiditySpan.textContent = forecast.daily[i].humidity;
    }
}
cityInput.addEventListener('click', function(event) {
    if(event) {
    
    cityBtn.click();
    }
});

// save city into local storage
var saveCity = function(city) {
    log(city)

    citiesArr.push(city);
    localStorage.setItem('cities', JSON.stringify(citiesArr));
}
// loads cities from local storage
var loadCities = function() {
    citiesArr = JSON.parse(localStorage.getItem('cities'));

    if (!citiesArr) {
        citiesArr = [];
        return false;
    } else if (citiesArr.length > 5) {
        // saves only the five most recent cities
        citiesArr.shift();
    }

    var recentCities = document.getElementById('#past-searches');
    var cityListUl = document.createElement('ul');
    cityListUl.className = 'list-group';
    recentCities.appendChild(cityListUl);
    

    for (var i = 0; i < citiesArr.length; i++) {
        var cityListItem = document.createElement('button');
        cityListItem.setAttribute('type', 'button');
        cityListItem.className = 'list-group-item';
        cityListItem.setAttribute('value', citiesArr[i]);
        cityListItem.textContent = citiesArr[i];
        cityListUl.prepend(cityListItem);
    }

    var cityList = document.getElementById('.city-list');
    cityList.addEventListener('click', selectRecent)


}
// searches for city on ENTER key
loadCities();
cityBtn.addEventListener('click', formHandler)










// no lat lon