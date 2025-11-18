class WeatherApp {
  constructor() {
    this.apiKey = 'e36f541787664f561c41e6d9ae477761';
    this.baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
    this.recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    this.init();
  }

  init() {
    ['click', 'keypress'].forEach(evt =>
      document.getElementById(evt === 'click' ? 'searchBtn' : 'cityInput')
        .addEventListener(evt, e => (evt === 'click' || e.key === 'Enter') && this.handleSearch())
    );
    this.renderRecentSearches();
    this.getWeatherByCity('London');
  }

  handleSearch() {
    const city = document.getElementById('cityInput').value.trim();
    if (city) this.getWeatherByCity(city);
  }

  async getWeatherByCity(city) {
    this.toggle('loading', true);
    this.toggle('errorMessage', false);
    this.toggle('weatherInfo', false);

    try {
      await new Promise(r => setTimeout(r, 1000));
      const data = {
        name: city,
        main: {
          temp: Math.round(Math.random() * 30 + 5),
          feels_like: Math.round(Math.random() * 30 + 5),
          humidity: Math.round(Math.random() * 50 + 30)
        },
        weather: [{
          description: 'Partly cloudy',
          icon: '01d'
        }],
        wind: { speed: Math.round(Math.random() * 20 + 1) }
      };
      this.displayWeather(data);
      this.updateRecent(city);
    } catch {
      this.toggle('errorMessage', true);
    }
  }

  displayWeather(d) {
    this.toggle('loading', false);
    this.toggle('weatherInfo', true);
    document.getElementById('cityName').textContent = d.name;
    document.getElementById('currentTemp').textContent = d.main.temp;
    document.getElementById('weatherDescription').textContent = d.weather[0].description;
    document.getElementById('feelsLike').textContent = `${d.main.feels_like}°C`;
    document.getElementById('humidity').textContent = `${d.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${d.wind.speed} m/s`;
    document.getElementById('weatherIcon').src = 'https://via.placeholder.com/100x100/74b9ff/ffffff?text=☀️';
  }

  updateRecent(city) {
    this.recentSearches = [city, ...this.recentSearches.filter(c => c !== city)].slice(0, 5);
    localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
    this.renderRecentSearches();
  }

  renderRecentSearches() {
    document.getElementById('recentList').innerHTML = this.recentSearches
      .map(c => `<div class="recent-item" onclick="weatherApp.getWeatherByCity('${c}')">${c}</div>`).join('');
  }

  toggle(id, show) {
    document.getElementById(id).classList.toggle('hidden', !show);
  }
}

const weatherApp = new WeatherApp();
