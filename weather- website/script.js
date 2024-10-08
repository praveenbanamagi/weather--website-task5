const apiKey = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
const weatherInfo = document.getElementById('weatherInfo');
const fetchWeatherButton = document.getElementById('fetchWeather');
const getCurrentLocationButton = document.getElementById('getCurrentLocation');
const locationInput = document.getElementById('location');

function displayWeather(data) {
    if (data.cod === '404' || data.cod === '400') {
        weatherInfo.innerHTML = `<p>Location not found.</p>`;
        return;
    }

    const tempCelsius = (data.main.temp - 273.15).toFixed(1); // Convert Kelvin to Celsius
    const weatherHtml = `
        <h2>Weather in ${data.name}</h2>
        <p>Temperature: ${tempCelsius} °C</p>
        <p>Weather: ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
    weatherInfo.innerHTML = weatherHtml;
}

function fetchWeather(location) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => displayWeather(data))
        .catch(error => console.error('Error fetching weather data:', error));
}

function fetchWeatherByCoords(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => displayWeather(data))
        .catch(error => console.error('Error fetching weather data:', error));
}

fetchWeatherButton.addEventListener('click', () => {
    const location = locationInput.value.trim();
    if (location) {
        fetchWeather(location);
    } else {
        weatherInfo.innerHTML = `<p>Please enter a location.</p>`;
    }
});

getCurrentLocationButton.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoords(latitude, longitude);
            },
            error => {
                weatherInfo.innerHTML = `<p>Error getting location: ${error.message}</p>`;
            }
        );
    } else {
        weatherInfo.innerHTML = `<p>Geolocation is not supported by this browser.</p>`;
    }
});
