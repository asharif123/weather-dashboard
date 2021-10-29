var cityName = document.querySelector("#city-weather-search-value");
var cityForm = document.querySelector("#city-weather-form");
var previousCityResults = document.querySelector(".city-weather-previous-search");
var citySearchResults = document.querySelector(".city-weather-result");
var fiveDayForecast = document.querySelector(".city-weather-5-day-forecast");

// API KEY
var apiKey = '8aaaf47fd1335c41e91dc5418eca16e9';

// function handles submissions when user enters city and hits submit
function submitCityData(event) {
    event.preventDefault();
    if (cityName) {
        var cityValue = cityName.value.trim();
        getCityData(cityName);
        storeCityData(cityValue);
        cityName.value = '';
    }
    else {
        window.alert("City does not exist!");
        return;
    }
}


// use local storage to store every city inputted by user
function storeCityData(city) {
    allCityData.push(city);
    localStorage.setItem("cityStorage", JSON.stringify(allCityData));

    // load previous city data to update the data
    loadPreviousCityData();

}

// load stored cities that user inputted
var allCityData = JSON.parse(localStorage.getItem("cityStorage")) || [];

function loadPreviousCityData() {
    // used to remove prev nodes so that we dont have repeating elements
    previousCityResults.innerHTML = '';

    // create search button for each city in the array
    for (var i = 0; i < allCityData.length; i++) {
        var previousCityName = document.createElement('button');
        previousCityName.className = 'city-weather-previous-search-button';
        previousCityName.setAttribute("city-name", allCityData[i]);
        // add the city name to the button
        previousCityName.append(allCityData[i]);
        // add the button to the previous city results div
        previousCityResults.append(previousCityName); 
        
        // user clicks on previousCityName button of  previous searches and see weather info displayed
        previousCityName.addEventListener("click", function (event) {
            var element = event.target;
            var cityName = element.getAttribute("city-name");
            getCityData(cityName);
            cityName = '';
        })
    }
}

// function retrives actual weather data based off city user inputted
function getCityData(city) {
    var openWeatherURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + (city.value || city) + '&appid=' + apiKey + '&units=imperial';
    console.log(openWeatherURL);
    fetch(openWeatherURL)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {

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
    citySearchResults.innerHTML = '';
    var currentCityInfo = document.createElement('div');
    currentCityInfo.className = "current-city-information";
    var currentCityName = document.createElement('h1');

    // function to add current date associated with weather
    var currentDate = document.createElement('h1');
    currentDate.id = 'current-city-date';

    // grab the current date for corresponding weather
    n = new Date();
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
    currentCityTemp.innerHTML = "Temp: " + weatherData["main"]["temp"] + " F" + `<img src="https://openweathermap.org/img/wn/${weatherData["weather"][0].icon}.png" alt="Weather Icon"/>`;
    currentCityWindSpeed.append("Wind: " + weatherData["wind"]["speed"] + " MPH")
    currentCityHumidity.append("Humidity: " + weatherData["main"]["humidity"] + " %")


    citySearchResults.appendChild(currentCityInfo);
    citySearchResults.appendChild(currentCityTemp);
    citySearchResults.appendChild(currentCityWindSpeed);
    citySearchResults.appendChild(currentCityHumidity);
}

// function to display UVI index
function displayCurrentUVIIndex(weatherData) {
    // API to grab the UVI Index
    var openWeatherUVIURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + weatherData["coord"].lat + "&lon=" + weatherData["coord"].lon + "&exclude=hourly,daily&appid=" + apiKey;
    
    // create a new span for each currentCityUVIIndex
    var currentCityUVIIndex = document.createElement("span");
    fetch(openWeatherUVIURL)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
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
    fiveDayForecast.innerHTML = '';
    var fiveDayForecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + weatherData["name"] + "&appid=" + apiKey + '&units=imperial';

    fetch(fiveDayForecastURL)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log("DATA", data);
                    console.log("ICON", data["list"][0]["weather"][0].icon);

                    for (var i = 3; i < data["list"].length; i = i + 8) {

                        // create DOM elements to hold five day forecast info
                        var foreCastCard = document.createElement("div");
                        foreCastCard.className = "city-weather-forecast-card";
                        var foreCastCardDate = document.createElement("h2");
                        var foreCastCardIcon = document.createElement("div");
                        foreCastCardIcon.className = "city-weather-forecast-card-icon";
                        var foreCastCardTemp = document.createElement("span");
                        var foreCastCardWind = document.createElement("span");
                        var foreCastCardHumidity = document.createElement("span");


                        // add the data to the created DOM elements
                        foreCastCardDate.append(data["list"][i]["dt_txt"].split(' ')[0])
                        foreCastCardIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${data["list"][i]["weather"][0].icon}.png" alt="Weather Icon"/>`;
                        foreCastCardTemp.append("Temp: " + data["list"][i]["main"].temp + " F");
                        foreCastCardWind.append("Wind: " + data["list"][i]["wind"].speed + " mph");
                        foreCastCardHumidity.append("Humidity: " + data["list"][i]["main"].humidity + " %");

                        foreCastCard.appendChild(foreCastCardDate);
                        foreCastCard.appendChild(foreCastCardIcon);
                        foreCastCard.appendChild(foreCastCardTemp);
                        foreCastCard.appendChild(foreCastCardWind);
                        foreCastCard.appendChild(foreCastCardHumidity);
                        fiveDayForecast.appendChild(foreCastCard);


                    };

                })
            }
        })
}

// when user clicks on submit after entering city, submit form data
cityForm.addEventListener("submit", submitCityData);

// run this function immediately to see loaded cities
loadPreviousCityData();
