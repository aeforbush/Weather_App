// makes array from local storage 
var searchCityName = JSON.parse(localStorage.getItem('City Name')) || []
var currentForcastEl = $("#current-forecast")
var forecastEl = $('#five-day-forecast')
var forecastTitle = $('#forecast-title')
var historyList = $('#search-history')

var apiKey = "f3c6f7687f7f43a162f3912305630533"


// filters array for unique values
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

var unique = searchCityName.filter(onlyUnique);

// function displayWeather() {

//   // add border
//   $(currentForcastEl).addClass('border')
//   // empty's out container  
//   $("#five-day-forecast").empty();

//   // grabs cityName from search input
//   var cityName = $('#city-name').val()
//    console.log(cityName);
//   if (cityName == "") {
//     alert("Please enter a city.")
//     return
//   }

//   // sends fetch to OpenWeather map
//   fetchWeatherData(cityName)






$("#search-history").on('click', function (event) {
  if (event.target.matches('button')) {
    console.log(event.target.innerText)

  cityName = ($(event.target).text())
  // adds border
  $(currentForcastEl).addClass('border')
  fetchWeatherData(cityName)
  }
});

console.log('hit')
$("#display-weather").on("submit", function (event) {
  event.preventDefault();
  // displayWeather();
  // add border
  $(currentForcastEl).addClass('border')
  // empty's out container  
  $("#five-day-forecast").empty();

  // grabs cityName from search input
  var cityName = $('#city-name').val()
  // console.log(cityName);
  if (cityName == "") {
    alert("Please enter a city.")
    return
  }

  // sends fetch to OpenWeather map
  fetchWeatherData(cityName)


  // console.log(cityName)

});



// fetches forecast from OpenWeather API
var fetchWeatherData = function (cityName) {
  // console.log(cityName);
  // sends fetch to OpenWeather map
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${apiKey}`)
    .then(function (response) {
      if (response) {
        response.json().then(function (data) {

          // current forecast 
          currentForecast(data)
          // five day forecast
          FiveDayForecast(data)
          //console.log(data);

        });

        // saves search into array
        searchCityName.push(cityName)
        //console.log(cityName);
        // pushes array into localstorage 
        saveSearch();

        // adds list item button if city isn't in search history
        var liEl = document.createElement('li')
        var buttonEl = document.createElement('button')
        buttonEl.textContent = cityName;
        cityName = cityName.replace(/\s+/g, '')
        buttonEl.setAttribute('class', 'btn btn-primary' + cityName);
        buttonEl.setAttribute('type', 'button');
        // search for city in history
        if ($('.' + cityName).length) {
          return
        } else {
          liEl.append(buttonEl);
          historyList.prepend(liEl);

          // $(".btn-primary").on('click', function (event) {
          //   cityName = ($(this).text())
          //   // adds border
          //   $(currentForcastEl).addClass('border')
          //   fetchWeatherData(cityName)
          // })
        }
      } else {
        // if city doesn't exist
        alert('Error, City not found');
        document.getElementById("city-name").value = "";
        return
      }
    });
}



// appends array into buttons displaying search history
var getHistory = function () {
  for (var i = unique.length - 1; i >= 0; i--) {
    var liEl = document.createElement('li');
    var buttonEl = document.createElement('button');
    buttonEl.textContent = unique[i];
    buttonEl.setAttribute('class', 'btn btn-primary ' + unique[i].replace(/\s+/g, ""));
    buttonEl.setAttribute('type', 'button');

    liEl.append(buttonEl);
    historyList.append(liEl);

  }
}

// seaves searches into local storage 
var saveSearch = function () {
  localStorage.setItem('City Name', JSON.stringify(searchCityName));
}

// displays current forecast 
var currentForecast = function (weather) {
  //Gets Lat and Long of City 
  var cityLat = weather.city.coord.lat
  var cityLon = weather.city.coord.lon

  //Makes Fetch call to get UVI and adds to weatherEl
  fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {


      // clears out data
      currentForcastEl.empty();

      // adds city title 
      var cityTitle = document.createElement('h2')
      cityTitle.textContent = weather.city.name + " (" + moment.unix(weather.list[0].dt).format("MMM D, YYYY") + ') ';

      // adds daily weather icon
      var forecastIcon = document.createElement('img')
      forecastIcon.setAttribute('src', `https://openweathermap.org/img/wn/${weather.list[0].weather[0].icon}@2x.png`)
      cityTitle.append(forecastIcon);

      currentForcastEl.append(cityTitle);

      // adds daily temperature
      var forecastTemp = document.createElement('p')
      forecastTemp.textContent = 'Temp: ' + weather.list[0].main.temp + '°F';
      currentForcastEl.append(forecastTemp);

      // adds daily humidity
      var forecastHumidity = document.createElement('p')
      forecastHumidity.textContent = 'Humidity: ' + weather.list[0].main.humidity + '%';
      currentForcastEl.append(forecastHumidity);

      // adds daily wind speed
      var windSpeed = document.createElement('p')
      windSpeed.textContent = 'Wind: ' + weather.list[0].wind.speed + 'MPH';
      currentForcastEl.append(windSpeed);

      // adds uvi number
      var cityUviText = document.createElement('p')
      var cityUviHolder = document.createElement('span')
      cityUvi = data.current.uvi
      cityUviHolder.textContent = cityUvi
      cityUviText.textContent = 'UV Index: '
      cityUviText.append(cityUviHolder)
      currentForcastEl.append(cityUviText)

      // displays different results of uvi
      if (cityUvi <= 3) {
        $(cityUviHolder).addClass("low");
      } else if (cityUvi <= 5 && cityUvi > 3) {
        $(cityUviHolder).addClass("moderate");
      } else if (cityUvi <= 7 && cityUvi > 5) {
        $(cityUviHolder).addClass("high");
      } else if (cityUvi <= 10 && cityUvi > 7) {
        $(cityUviHolder).addClass("very-high");
      } else if (cityUvi > 10) {
        $(cityUviHolder).addClass("extreme")
      }

    });

}


// display five day forecast
var FiveDayForecast = function (weather) {
  // clear out forecastEl div 
  // forecastEl.empty();
  document.querySelector('#five-day-forecast').textContent = "";

  // iterates through data to generate five day
  for (i = 5; i < weather.list.length; i = i + 8) {
    var forecastCard = document.createElement('div')
    forecastCard.setAttribute('class', 's12 m2 forecastCard')


    // gets date for each day
    var forecastDate = document.createElement('h6')
    forecastDate.textContent = moment.unix(weather.list[i].dt).format("MMM D, YYYY");
    forecastCard.append(forecastDate)

    // gets Image for each day
    var forecastImage = document.createElement('img')
    forecastImage.setAttribute('src', `https://openweathermap.org/img/wn/${weather.list[i].weather[0].icon}@2x.png`)
    forecastImage.setAttribute('class', 'forecastImage')
    forecastCard.append(forecastImage)

    // gets Temp for each day
    var forecastTemp = document.createElement('p')
    forecastTemp.textContent = 'Temp: ' + weather.list[i].main.temp + '°F'
    forecastTemp.setAttribute('class', 'forecastTemp')
    forecastCard.append(forecastTemp)

    // gets Wind for each day
    var forecastWind = document.createElement('p')
    forecastWind.textContent = 'Wind: ' + weather.list[i].wind.speed + 'MPH';
    forecastCard.append(forecastWind)

    // gets Humidity for each day
    var forecastHumidity = document.createElement('p')
    forecastHumidity.textContent = 'Humidity: ' + weather.list[i].main.humidity + '%'
    forecastCard.append(forecastHumidity)

    // appends current forecast info to forecast container 
    forecastEl.append(forecastCard)
  }

}

getHistory();

//$(".btn-primary").on('click', function (event) {
cityName = ($(this).text())
  // add border
  //$(currentForcastEl).addClass('border')
// fetchWeatherData(cityName)
//})




