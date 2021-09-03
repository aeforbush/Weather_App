var citiesArr = [];

var cityInputEl = document.querySelector("#city");
var cityBtn = document.querySelector("#btn");
var cityNameEl = document.querySelector("#searched-city")
var apiKey = 'f3c6f7687f7f43a162f3912305630533'
let log = console.log;

var formHandler = function(event) {
    log(event);
    // get city name 
    var searchedCity = cityInputEl.nodeValue.trim();

    if (searchedCity) {
        getCityForecast(searchedCity);
        cityInputEl.value = "";
    } else {
        alert("Please enter a city!");
    };
};

// getcityName

// get currentForecast with API
var getCityForecast = function(city) {
    var CurrentWeatherApi = 'https://api.openweathermap.org/data/2.5/weather?q=${city}&appid={apiKey}'
    fetch(CurrentWeatherApi).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                getCityForecast(city);
                
                // saves searched city and refreshes recent city list
                if (document.querySelector('.city-list')) {
                    document.querySelector('.city-list').remove();
                }

                saveCity(city);
                loadCities();
                log(city);
            })
        } else {
            alert('Error: ${response.statusText}')
        }
    })
    .catch(function(error) {
        alert('Unable to load weather!');
    })
}
// get fiveDay 
var getFiveDay = function(city) {
    var CurrentWeatherApi = 'api.openweathermap.org/data/2.5/forecast?q={city}&appid={API key}'
    fetch(CurrentWeatherApi).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                cityNameEl.textContent = `${city} (${moment().format("M/D/YYYY")})`;

                log(data);
                
                currentForecast(data);
                fiveDayForecast(data);

            });
        } 
    })

}


// display currentForecast

var currentForecast = function(forecast) {

    var forecasteEl = document.querySelector('.city-forecast');
    forecasteEl.classList.remove('hide');

    var weatherIconEl = document.querySelector('#icon');
    var currentIcon = forecast.currentForecast.weather[0].icon;
    weatherIconEl.setAttribute('src', 'http://openweathermap.org/img/wn/${currentIcon}.png');

    displayTemp('#current-temp', forecast.current['temp']);

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
        iconImg.setAttribute('scr', 'http://openweathermap.org/img/wn/${iconCode}.png');

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

    var recentCities = document.querySelector('#recent-cities');
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