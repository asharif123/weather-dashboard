var cityName = document.querySelector("#city-weather-search-value");
var cityForm = document.querySelector("#city-weather-form");
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
console.log(cityName.value)

function submitCityData(event) {
    event.preventDefault();
    if (cityName) {
        var cityValue = cityName.value.trim().replace(" ", '');
        console.log(cityValue);
        getCityData(cityName);
        cityName.value = '';
    }
    else {
        window.alert("City does not exist!");
    }
}

// function retrives actual weather data based off city user inputted
function getCityData(city) {
    var apiKey = '8aaaf47fd1335c41e91dc5418eca16e9';
    var openWeatherURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city.value + '&appid=' + apiKey + '&units=imperial';
    console.log(openWeatherURL);
    fetch(openWeatherURL)
        .then(function(response){
            if(response.ok) {
                console.log(response.json);
                response.json().then(function(data) {
                    console.log(data);
                })
            }

            else {
                window.alert("Please enter a valid city name!")
            }
        })


        .catch(function (error) {
            alert('Please enter a city name!');
        });
}

cityForm.addEventListener("submit", submitCityData);

