// makes array from local storage 
var searchCityName = JSON.parse(localStorage.getItem('City Name')) || [];
var forecastEl = $('#five-day-forecast')
//var forecastTitle = $('#forecast-title')

var apiKey = "f3c6f7687f7f43a162f3912305630533"

// filters array for unique values
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  
  var unique = searchCityName.filter(onlyUnique);
  
  
  // when 'Search' button is clicked
  $("#search-btn").on("click", function () {
  
  // empty's out container  
  $("#five-day-forecast").empty();
  
  // grabs cityName from search input
      var cityName = $('#city-name').val()
      // console.log(cityName);
      if (cityName == "") {
          alert("Please enter in a Destination")
          return
      }
  
  // sends fetch to openweather map
    fetchWeatherData(cityName)
    //console.log(cityName)
  });
  


var fetchWeatherData = function (cityName) {
	// sends fetch to openweather map
	fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${apiKey}`)
		.then(function (response) {
			if (response.ok) {
				response.json().then(function (data) {

					//Five day forecast
					FiveDayForecast(data)
				});

				// saves search into array

				searchCityName.push(cityName)
				console.log(cityName);


				// pushes array into localstorage 
				saveSearch();

		}
	})
}

// saves searches into local storage
var saveSearch = function () {
	localStorage.setItem('City Name', JSON.stringify(searchCityName));
}

// display five day forecast
var FiveDayForecast = function (weather) {


	for (i = 5; i < weather.list.length; i = i + 8) {
		var forecastCard = document.createElement('div')
		forecastCard.setAttribute('class', 's12 m2')
		

		//Gets date for each day
		var forecastDate = document.createElement('h6')
		forecastDate.textContent = moment.unix(weather.list[i].dt).format("MMM D, YYYY");
		forecastCard.append(forecastDate)

		//Gets Image for each day
		var forecastImage = document.createElement('img')
		forecastImage.setAttribute('src', `https://openweathermap.org/img/wn/${weather.list[i].weather[0].icon}@2x.png`)
		forecastImage.setAttribute('class', 'forecastImage')
		forecastCard.append(forecastImage)

		//Gets Temp for each day
		var forecastTemp = document.createElement('p')
		forecastTemp.textContent = 'Temp: ' + weather.list[i].main.temp + '°F'
		forecastTemp.setAttribute('class', 'forecastTemp')
		forecastCard.append(forecastTemp)

		//Gets Wind for each day
		var forecastWind = document.createElement('p')
		forecastWind.textContent = 'Wind: ' + weather.list[i].wind.speed + 'MPH';
		forecastCard.append(forecastWind)

		//Gets Humidity for each day
		var forecastHumidity = document.createElement('p')
		forecastHumidity.textContent = 'Humidity: ' + weather.list[i].main.humidity + '%'
		forecastCard.append(forecastHumidity)

		//Appends Forecast Card to Forecast Container
		forecastEl.append(forecastCard)
	}

}





