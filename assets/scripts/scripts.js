var cityValue = document.querySelector("#city-weather-search-value");
var submitButton = document.querySelector("#city-weather-search-button");
var previousCityResults = document.querySelector(".city-weather-previous-search");
var citySearchResults = document.querySelector(".city-weather-result");
var fiveDayForecast = document.querySelector(".city-weather-5-day-forecast");

// user types in a city in the search box and when user hits submit, store the city in local storage
// when user types in the city, user should see the following:
    // the city name with today's weather, temp, wind, humidity, uv index
    // 5 day forecast having dates, pic, weather, temp and humidity
// take the city user entered and turn it into clickable button so user can click to see weather/5 day forecast

// 1 - create function where if user enters city name it gets stored in local storage and is clickable button
// 2 - city that was search gets added dynamically to previouscityResults div from local storage
// 3 - once user enters city name, use OpenWeather One Call API w/ city nameto retrieve today's weather that is 
//     added dynamically to city weather result div
// 4-  also, auto generate the 5 day forecast that gets added to city-weather-5-day-forecast div


// function handles submissions when user enters city and hits submit
function submitCityData(event) {
    event.preventDefault();
    var cityName = cityValue.value().trim();
    if (cityName) {
        getCityData(cityName);
        cityValue = '';
    }
    else {
        window.alert("Invalid input!");
    }
}

// function retrives actual weather data based off city user inputted
function getCityData(city) {
    var apiKey = '8aaaf47fd1335c41e91dc5418eca16e9';
    var openWeatherURL = `https://api.openweathermap.org/data/2.5/onecall?q=${city}&APPID=${apiKey}`;
    console.log("CITY!!!!")
    fetch(openWeatherURL)
        .then(function(response){
            if (response.ok) {
                console.log(response.json);
            }
        })
}

submitButton.addEventListener("submit", submitCityData);

