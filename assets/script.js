var getWeather = function () {

    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}"

    // make a request to the url for call back
    fetch(apiUrl)
    .then(function(response) {
        response.json().then(function() {
            console.log(response);
        });
    });
 
    


}


