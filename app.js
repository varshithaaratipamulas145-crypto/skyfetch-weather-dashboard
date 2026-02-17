// Your OpenWeatherMap API Key
const API_KEY = '2d526502b4edcc24cbdee29970299226';  // Replace with your actual API key
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// ===============================
// DOM Elements
// ===============================
const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const weatherDisplay = document.getElementById("weather-display");

// ===============================
// Show Welcome Message on Load
// ===============================
weatherDisplay.innerHTML = `
    <div class="welcome-message">
        <h3>🌍 Welcome to SkyFetch</h3>
        <p>Enter a city name to get started!</p>
    </div>
`;

// ===============================
// Loading State
// ===============================
function showLoading() {
    weatherDisplay.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Fetching weather data...</p>
        </div>
    `;
}

// ===============================
// Error Display
// ===============================
function showError(message) {
    weatherDisplay.innerHTML = `
        <div class="error-message">
            <h3>❌ Oops!</h3>
            <p>${message}</p>
        </div>
    `;
}

// ===============================
// Display Weather
// ===============================
function displayWeather(data) {
    const weatherHTML = `
        <div class="weather-info">
            <h2 class="city-name">${data.name}</h2>
            <img class="weather-icon"
                src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"
                alt="Weather Icon"
            />
            <div class="temperature">${Math.round(data.main.temp)}°C</div>
            <div class="description">${data.weather[0].description}</div>
        </div>
    `;

    weatherDisplay.innerHTML = weatherHTML;

    // Focus back to input for better UX
    cityInput.focus();
}

// ===============================
// Async Weather Fetch Function
// ===============================
async function getWeather(city) {
    showLoading();

    const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;

    // Disable button while loading
    searchBtn.disabled = true;
    searchBtn.textContent = "Searching...";

    try {
        const response = await axios.get(url);
        console.log(response.data);
        displayWeather(response.data);

    } catch (error) {
        console.error("Error:", error);

        if (error.response && error.response.status === 404) {
            showError("City not found. Please check the spelling and try again.");
        } else {
            showError("Something went wrong. Please try again later.");
        }

    } finally {
        // Re-enable button
        searchBtn.disabled = false;
        searchBtn.textContent = "Search";
    }
}

// ===============================
// Search Function
// ===============================
function handleSearch() {
    const city = cityInput.value.trim();

    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    if (city.length < 2) {
        showError("City name must be at least 2 characters.");
        return;
    }

    getWeather(city);
    cityInput.value = "";
}

// ===============================
// Event Listeners
// ===============================
searchBtn.addEventListener("click", handleSearch);

cityInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        handleSearch();
    }
});
