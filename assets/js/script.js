var citiesArr = [];

var cityInput = document.querySelector("#city-input");
var cityBtn = document.querySelector("#search-btn");
var cityName = document.querySelector("#city-name")
var apiKey = 'f3c6f7687f7f43a162f3912305630533'
// let log = console.log;

var formHandler = function(event) {
    //log(event);
    // get city name 
    var searchedCity = cityInput
    .value
    .trim()
    .toLowerCase()
    .split(' ')
    .join(' ');

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
    //var CurrentWeatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
    .then(response=>console.log(response.json()))
    
    .then(data=>console.log(data));
   /* fetch(CurrentWeatherApi).then(function(response) {
        log(response.json());
        if (response.ok) {
            return json().then(function(data) {
                getCityForecast(city);
                
                // saves searched city and refreshes recent city list
                if (document.querySelector('.city-list')) {
                    document.querySelector('.city-list').remove();
                }

                saveCity(city);
                loadCities();
                
            })
        } else {
            alert('Error: ${response.statusText}')
        }
    })
    .catch(function(error) {
        alert('Unable to load weather!');
    })*/
}
// uses city name to fetch current weather and five day forecast

var getCityForecast = function(city) {
    //log(city);
    var apiCall = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    //log(city);
    fetch(apiCall).then(function(response) {
       
        if (response) {
            response.json().then(function(data) {

                // identifies city name in forecast
                cityName.textContent = `${city} (${moment().format("M/D/YYYY")})`;
            
                
                currentForecast(data);
                fiveDayForecast(data);
            });
        }
    })
}



// helper function to select HTML element and display rounded temperature
var displayTemp = function(element, temperature) {
    var tempEl = document.querySelector(element);
    var elementText = Math.round(temperature);
    tempEl.textContent = elementText;
}

// display currentForecast

var currentForecast = function(forecast) {

    var forecasteEl = document.querySelector('.city-forecast');
    forecasteEl.textContent;

    var weatherIconEl = document.querySelector('#today-icon');
    var currentIcon = forecast.weather[0].icon;
    weatherIconEl.setAttribute('src', `http://openweathermap.org/img/wn/${currentIcon}.png`);
    weatherIconEl.setAttribute('alt', forecast.weather[0].main)

    displayTemp('#current-temp', forecast.current['temp']);
    displayTemp('#current-feels-like', forecast.current['feels_like']);
    displayTemp('#current-high', forecast.daily[0].temp.max);
    displayTemp('#current-low', forecast.daily[0].temp.min);

    var currentConditionEl = document.querySelector('#current-condition');
    currentConditionEl.textContent = forecast.weather[0].description
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');

    var currentHumidityEl = document.querySelector('#current-humidity');
    currentHumidityEl.textContent = forecast.current['humidity'];

    var currentWindEl = document.querySelector('#current-wind-speed');
    currentWindEl.textContent = forecast.current['wind-speed'];

    var UvEl = document.querySelector('#current-uv');
    var currentUv = forecast.current['uv'];
    UvEl.textcontent = currentUv;
}

// display fiveDay
var fiveDayForecast = function(forecast) {
    for (var i = 0; i < 6; i++) {
        var dateP = document.querySelector('#date-' + i);
        dateP.textContent = moment().add(i, 'days').format('M/D/YYYY');

        var iconImg = document.querySelector('#icon-' + i);
        var iconCode = forecast.daily[i].weather[0].icon;
        iconImg.setAttribute('scr', `http://openweathermap.org/img/wn/${iconCode}.png`);

        displayTemp('#temp-' + i, forecast.daily[i].temp.day);

        var humiditySpan = document.querySelector('#humidty-' + i);
        humiditySpan.textContent = forecast.daily[i].humidity;
    }
}

// save city into local storage
var saveCity = function(city) {

    cityArr.push(city);
    localStorage.setItem('cities', JSON.stringify(cityArr));
}
// loads cities from local storage
var loadCities = function() {
    cityArr = JSON.parse(localStorage.getItem('cities'));

    if (!cityArr) {
        cityArr = [];
        return false;
    } else if (cityArr.length > 5) {
        // saves only the five most recent cities
        cityArr.shift();
    }

    var recentCities = document.querySelector('#past-searches');
    var cityListUl = document.createElement('ul');
    cityListUl.className = 'list-group list-group-flush city-list';
    recentCities.appendChild(cityListUl);

    for (var i = 0; i < cityArr.length; i++) {
        var cityListItem = document.createElement('button');
        cityListItem.setAttribute('type', 'button');
        cityListItem.className = 'list-group-item';
        cityListItem.setAttribute('value', cityArr[i]);
        cityListItem.textContent = cityArr[i];
        cityListUl.prepend(cityListItem);
    }

    var cityList = document.querySelector('.city-list');
    cityList.addEventListener('click', selectRecent)
}

var selectRecent = function(event) {
    var clickedCity = event.target.getAttribute('value');

    getCoords(clickedCity);
}

loadCities();
cityBtn.addEventListener('click', formHandler)

// searches for city when button clicked
cityInput.addEventListener('keyup', function(event) {
    if (event.keyCode === 13) {
        cityBtn.click();
    }
});

// no lat lon