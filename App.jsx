import { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const getWeather = async () => {
    setError("");
    setWeather(null);

    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("City not found ");
        return;
      }
      const { latitude, longitude, name, country } = geoData.results[0];
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=precipitation&forecast_days=1&timezone=auto`
        );
        
      const weatherData = await weatherRes.json();
      const rainExpected = weatherData.hourly.precipitation.some(p => p > 0);
      setWeather({
        city: `${name}, ${country}`,
        temperature: weatherData.current_weather.temperature,
        windspeed: weatherData.current_weather.windspeed,
        time: weatherData.current_weather.time,
        rain: rainExpected,
      });
    } catch (err) {
      setError("Failed to fetch weather data.");
      console.error(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim() !== "") {
      getWeather();
    }
  };

  return (
    <div className="app">
      <h1 className="heading"> City Weather App</h1>

      <form className="bar"onSubmit={handleSubmit}>
        <input className="info"
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-card">
          <h2>{weather.city}</h2>
          <p> Temperature: {weather.temperature}°C</p>
          <p> Wind Speed: {weather.windspeed} km/h</p>
          <p> Time: {new Date(weather.time).toLocaleTimeString()}</p>
          <p>{weather.rain ? " Rain expected" : " No rain expected"}</p>
        </div>
      )}
    </div>
  );
}

export default App;
