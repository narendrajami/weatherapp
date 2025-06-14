const apiKey = 'ada6e2d52fae1fdab7a61a213d41008c'; // Replace with your actual key

// Theme toggle
function toggleTheme() {
  document.body.classList.toggle("dark");
}

// Get weather by city
async function getWeather(cityName = null) {
  const city = cityName || document.getElementById('cityInput').value.trim();
  const resultBox = document.getElementById('weatherResult');

  if (!city) {
    resultBox.innerHTML = '<p>Please enter a city name.</p>';
    return;
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );
    if (!res.ok) throw new Error("City not found");

    const data = await res.json();
    displayWeather(data);
    saveRecent(city);
  } catch (err) {
    resultBox.innerHTML = `<p>Error: ${err.message}</p>`;
  }
}

// Get weather by geolocation
function getLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const resultBox = document.getElementById('weatherResult');

      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
        );
        if (!res.ok) throw new Error("Location not found");
        const data = await res.json();
        displayWeather(data);
        saveRecent(data.name);
      } catch (err) {
        resultBox.innerHTML = `<p>Error: ${err.message}</p>`;
      }
    });
  } else {
    alert("Geolocation not supported");
  }
}

// Show weather data
function displayWeather(data) {
  const { name, sys, main, weather } = data;
  const icon = getWeatherEmoji(weather[0].main);

  document.getElementById('weatherResult').innerHTML = `
    <h2>${icon} ${name}, ${sys.country}</h2>
    <p><strong>${weather[0].main}</strong> - ${weather[0].description}</p>
    <p>🌡 Temperature: ${main.temp}°C</p>
    <p>💧 Humidity: ${main.humidity}%</p>
  `;
}

// Emoji for basic weather
function getWeatherEmoji(condition) {
  switch (condition.toLowerCase()) {
    case 'clear': return '☀️';
    case 'clouds': return '☁️';
    case 'rain': return '🌧️';
    case 'drizzle': return '🌦️';
    case 'thunderstorm': return '⛈️';
    case 'snow': return '❄️';
    case 'mist':
    case 'fog':
      return '🌫️';
    default: return '🌡️';
  }
}

// Save and load recent searches
function saveRecent(city) {
  let list = JSON.parse(localStorage.getItem('recentSearches') || '[]');
  if (!list.includes(city)) {
    list.unshift(city);
    if (list.length > 5) list = list.slice(0, 5);
    localStorage.setItem('recentSearches', JSON.stringify(list));
  }
  showRecent();
}

function showRecent() {
  const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
  const ul = document.getElementById('recentList');
  ul.innerHTML = '';
  recent.forEach(city => {
    const li = document.createElement('li');
    li.textContent = city;
    li.onclick = () => getWeather(city);
    ul.appendChild(li);
  });
}

// Initial load
showRecent();
