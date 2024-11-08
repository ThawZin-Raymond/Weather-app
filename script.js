const searchButton = document.querySelector(".search-button");
const currentLocationButton = document.querySelector(
  ".current-location-button"
);
const cityInput = document.getElementById("city");
const todayDetails = document.querySelector(".today-details");
const forecastContainer = document.querySelector(".weather-cards");

const API_KEY = "API KEY";
const API_URL = "https://api.openweathermap.org/data/2.5/";

// Search by city name
searchButton.addEventListener("click", () => {
  const city = cityInput.value;
  if (city) {
    getWeatherByCity(city);
  }
});

// Get weather by city name
const getWeatherByCity = (city) => {
  fetch(`${API_URL}weather?q=${city}&appid=${API_KEY}&units=metric`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.cod === "404") {
        alert("City not found");
      } else {
        displayWeather(data);
        getForecast(data.coord.lat, data.coord.lon);
      }
    })
    .catch((error) => console.error("Error fetching weather:", error));
};

// Get current location weather
currentLocationButton.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    getWeatherByLocation(latitude, longitude);
  });
});

// Fetch weather by current location
const getWeatherByLocation = (latitude, longitude) => {
  fetch(
    `${API_URL}weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
  )
    .then((response) => response.json())
    .then((data) => {
      displayWeather(data);
      getForecast(latitude, longitude);
    })
    .catch((error) => alert("Unable to get current location weather."));
};

// Display today's weather data
const displayWeather = (data) => {
  const { name } = data;
  const { description, icon } = data.weather[0];
  const { temp, humidity } = data.main;
  const { speed } = data.wind;

  todayDetails.innerHTML = `
        <h2>${name}</h2>
        <h3>${description}</h3>
        <h5>Temperature: ${temp}°C</h5>
        <h5>Wind: ${speed} M/S</h5>
        <h5>Humidity: ${humidity}%</h5>
        <div class="icon">
            <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="weather icon">
            <h6>${description}</h6>
        </div>
  `;
};

// Fetch 5-day forecast (adjusting for daily averages if needed)
const getForecast = (lat, lon) => {
  fetch(
    `${API_URL}forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  )
    .then((response) => response.json())
    .then((data) => {
      displayForecast(data);
    })
    .catch((error) => alert("Unable to get forecast data."));
};

// Display the 5-day forecast
const displayForecast = (data) => {
  forecastContainer.innerHTML = "";

  // Get a list of forecast entries at 12:00 pm each day (to approximate daily forecast)
  const dailyData = data.list.filter((entry) =>
    entry.dt_txt.includes("12:00:00")
  );

  dailyData.forEach((day) => {
    const {
      dt,
      main: { temp, humidity },
      weather,
      wind: { speed },
    } = day;
    const dayName = new Date(dt * 1000).toLocaleDateString("en-us", {
      weekday: "long",
    });
    const icon = weather[0].icon;

    forecastContainer.innerHTML += `
            <li class="card">
                <h3>${dayName}</h3>
                <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="weather icon">
                <h5>Temperature: ${temp}°C</h5>
                <h5>Wind: ${speed} M/S</h5>
                <h5>Humidity: ${humidity}%</h5>
            </li>
        `;
  });
};
