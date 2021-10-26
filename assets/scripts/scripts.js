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


function displayTime() {
    citySearchResults.text(moment().format('MMM DD, YYYY [at] hh:mm:ss a'));
}

setInterval(displayTime, 1000)

// function handles submissions when user enters city and hits submit

function submitCityData(event) {
    event.preventDefault();
    if (cityName) {
        var cityValue = cityName.value.trim().replace(" ", '');
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
                response.json().then(function(data) {
                    console.log(data)
                    displayCurrentWeather(data);
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

// function display weather information of city inputted by user
function displayCurrentWeather(weatherData) {
    var currentCityInfo = document.createElement('div');
    currentCityInfo.className = "current-city-information";
    var currentCityName = document.createElement('h1');
    
    // function to add current date associated with weather
    var currentDate = document.createElement('h1');
    currentDate.id = 'current-city-date';

    function displayTime() {
        document.querySelector("#current-city-date").text(moment().format('MMM DD, YYYY'));
    }

    setInterval(displayTime, 1000)

    currentCityInfo.appendChild(currentCityName);
    currentCityInfo.appendChild(currentDate);

    var currentCityTemp = document.createElement("span");
    var currentCityWindSpeed = document.createElement("span");
    var currentCityHumidity = document.createElement("span");
    var currentCityUV = document.createElement("span");

    currentCityName.append(weatherData.name);
    currentCityTemp.append("Temp: " + weatherData["main"]["temp"] + " F");
    currentCityTemp.innerHTML = `<img src="https://openweathermap.org/img/wn/${weatherData["weather"][0].icon}.png" alt="Weather Icon"/>`;
    currentCityWindSpeed.append("Wind: " + weatherData["wind"]["speed"] + " MPH")
    currentCityHumidity.append("Humidity: " + weatherData["main"]["humidity"] + " %")


    citySearchResults.appendChild(currentCityInfo);
    citySearchResults.appendChild(currentCityTemp);
    citySearchResults.appendChild(currentCityWindSpeed);
    citySearchResults.appendChild(currentCityHumidity);
}

cityForm.addEventListener("submit", submitCityData);

