import React, { useEffect, useState } from 'react';

const WeatherWidget = () => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=d1a2fabd13ec0c3744b5d28436c538b5`
      );
      const data = await response.json();
      setWeatherData(data);
    });
  }, []);

  if (!weatherData) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        backgroundImage: `url(https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png)`,
        color: 'white',
        padding: '20px',
        backgroundSize: 'cover',
      }}
    >
      <h2>{weatherData.name}</h2>
      <img
        src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
        alt="Weather icon"
      />
      <p>{Math.round(weatherData.main.temp - 273.15)}°C</p>
    </div>
  );
};

export default WeatherWidget;
