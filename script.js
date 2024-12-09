const apiKey = "6814cf37dbe823cd74f8c1039be5f38b"; // Replace with your OpenWeatherMap API key
const weatherDisplay = document.getElementById("weatherDisplay");
const locationInput = document.getElementById("locationInput");
const fetchWeatherButton = document.getElementById("fetchWeather");
const useLocationButton = document.getElementById("useLocation");

const displayWeather = (data) => {
    const { name, main, weather, wind } = data;
    weatherDisplay.innerHTML = `
        <h2>Weather in ${name}</h2>
        <p><strong>Temperature:</strong> ${(main.temp - 273.15).toFixed(1)}°C</p>
        <p><strong>Condition:</strong> ${weather[0].description}</p>
        <p><strong>Humidity:</strong> ${main.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${wind.speed} m/s</p>
    `;
};

const displayError = (message) => {
    weatherDisplay.innerHTML = `<p class="error">${message}</p>`;
};

const fetchWeatherByLocation = async (location) => {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`
        );
        if (!response.ok) throw new Error("Location not found");
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        displayError(error.message);
    }
};

const fetchWeatherByCoords = async (lat, lon) => {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
        );
        if (!response.ok) throw new Error("Unable to fetch weather data");
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        displayError(error.message);
    }
};

fetchWeatherButton.addEventListener("click", () => {
    const location = locationInput.value.trim();
    if (!location) {
        displayError("Please enter a location.");
        return;
    }
    fetchWeatherByLocation(location);
});

useLocationButton.addEventListener("click", () => {
    if (!navigator.geolocation) {
        displayError("Geolocation is not supported by your browser.");
        return;
    }
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoords(latitude, longitude);
        },
        () => {
            displayError("Unable to retrieve your location.");
        }
    );
});
