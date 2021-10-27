var cityName = document.querySelector("#city-weather-search-value");
var cityForm = document.querySelector("#city-weather-form");
var previousCityResults = document.querySelector(".city-weather-previous-search");
var citySearchResults = document.querySelector(".city-weather-result");
var fiveDayForecast = document.querySelector(".city-weather-5-day-forecast");

// 1 - create function where if user enters city name it gets stored in local storage and is clickable button
// 2 - city that was search gets added dynamically to previouscityResults div from local storage
// 3 - once user enters city name, use OpenWeather One Call API w/ city nameto retrieve today's weather that is 
//     added dynamically to city weather result div
// 4-  also, auto generate the 5 day forecast that gets added to city-weather-5-day-forecast div

// API KEY
var apiKey = '8aaaf47fd1335c41e91dc5418eca16e9';

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
    var openWeatherURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city.value + '&appid=' + apiKey + '&units=imperial';
    console.log(openWeatherURL);
    fetch(openWeatherURL)
        .then(function(response){
            if(response.ok) {
                response.json().then(function(data) {
                    console.log(data)
                    // display the current weather from retrived data
                    displayCurrentWeather(data);
                    
                    // function to get UVI Index of inputted city
                    displayCurrentUVIIndex(data);

                    // function to get 5 day forecast
                    displayFiveDayForecast(data);
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
    citySearchResults.textContent = '';
    var currentCityInfo = document.createElement('div');
    currentCityInfo.className = "current-city-information";
    var currentCityName = document.createElement('h1');
    
    // function to add current date associated with weather
    var currentDate = document.createElement('h1');
    currentDate.id = 'current-city-date';

    // grab the current date for corresponding weather
    n =  new Date();
    y = n.getFullYear();
    m = n.getMonth() + 1;
    d = n.getDate();
    currentDate.textContent = "(" + m + "/" + d + "/" + y + ")";

    currentCityInfo.appendChild(currentCityName);
    currentCityInfo.appendChild(currentDate);

    var currentCityTemp = document.createElement("span");
    var currentCityWindSpeed = document.createElement("span");
    var currentCityHumidity = document.createElement("span");
    currentCityName.append(weatherData.name);
    currentCityTemp.innerHTML = "Temp: " + weatherData["main"]["temp"] + " F" +`<img src="https://openweathermap.org/img/wn/${weatherData["weather"][0].icon}.png" alt="Weather Icon"/>`;
    currentCityWindSpeed.append("Wind: " + weatherData["wind"]["speed"] + " MPH")
    currentCityHumidity.append("Humidity: " + weatherData["main"]["humidity"] + " %")


    citySearchResults.appendChild(currentCityInfo);
    citySearchResults.appendChild(currentCityTemp);
    citySearchResults.appendChild(currentCityWindSpeed);
    citySearchResults.appendChild(currentCityHumidity);
}

// function to display UVI index
function displayCurrentUVIIndex(weatherData) {
    console.log("Lattitude", weatherData["coord"].lat);
    console.log("Longitude", weatherData["coord"].lon);
    var openWeatherUVIURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + weatherData["coord"].lat + "&lon=" + weatherData["coord"].lon + "&exclude=hourly,daily&appid=" + apiKey;
    var currentCityUVIIndex = document.createElement("span");
    currentCityUVIIndex.textContent = '';
    fetch(openWeatherUVIURL)
    .then(function(response){
        if(response.ok) {
            response.json().then(function(data) {
                if (data["current"].uvi < 3) {
                    currentCityUVIIndex.className = "current-city-success-uvi";
                }
                else if (data["current"].uvi < 7) {
                    currentCityUVIIndex.className = "current-city-warning-uvi";
                }

                else {
                    currentCityUVIIndex.className = "current-city-danger-uvi";
                }
                currentCityUVIIndex.textContent = "UV Index: "
                currentCityUVIIndex.append(data["current"].uvi);
                citySearchResults.appendChild(currentCityUVIIndex);
            })
        }
    })


    .catch(function (error) {
        alert('UVI index does not exist!');
    });

    
}

// function to display 5-day forecast
function displayFiveDayForecast(weatherData) {
    fiveDayForecast.textContent = '';
    var fiveDayForecastTitle = document.createElement('h2');
    fiveDayForecastTitle.textContent = "5-Day Forecast";
    fiveDayForecast.appendChild(fiveDayForecastTitle);
    var fiveDayForecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + weatherData["name"] + "&appid=" + apiKey + '&units=imperial';
    console.log(fiveDayForecastURL);
    fetch(fiveDayForecastURL)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log("DATA", data);
                // Pieces of information to add to div
                console.log("DATE", data["list"][0]["dt_txt"].split(' ')[0]);
                console.log("ICON", `<img src="https://openweathermap.org/img/wn/${data["list"][0]["weather"].icon}.png" alt="Weather Icon"/>`);
                console.log("TEMP", data["list"][0]["main"].temp);
                console.log("Wind Speed", data["list"][0]["wind"].speed);
                console.log("Humidity", data["list"][0]["main"].humidity)
                
                for (var i = 0; i < 33; i = i + 8) {
                    console.log(data["list"][i])
                    var foreCastCard = document.createElement("div");
                    foreCastCard.className = "city-weather-forecast-card";
                    console.log(data[i]);
                    // document.querySelector(".city-weather-forecast-card").appendChild(data[i]["dt-txt"])

                };
            })
        }
    })
}



cityForm.addEventListener("submit", submitCityData);

