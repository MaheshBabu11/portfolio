import { useEffect, useState } from 'react';
import config from '~/config.json';
import styles from './weather.module.css';

// Maps Open-Meteo WMO weather codes to an icon and label
const getCondition = code => {
  if (code === 0) return { icon: '☀️', label: 'Clear' };
  if (code <= 3) return { icon: '⛅', label: 'Partly cloudy' };
  if (code <= 48) return { icon: '🌫️', label: 'Fog' };
  if (code <= 57) return { icon: '🌦️', label: 'Drizzle' };
  if (code <= 67) return { icon: '🌧️', label: 'Rain' };
  if (code <= 77) return { icon: '❄️', label: 'Snow' };
  if (code <= 82) return { icon: '🌧️', label: 'Showers' };
  if (code <= 86) return { icon: '❄️', label: 'Snow showers' };
  return { icon: '⛈️', label: 'Thunderstorm' };
};

export const Weather = props => {
  const [weather, setWeather] = useState(null);
  const [now, setNow] = useState(() => new Date());
  const { city, latitude, longitude } = config.location;

  useEffect(() => {
    const controller = new AbortController();

    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`,
      { signal: controller.signal }
    )
      .then(res => res.json())
      .then(({ current, timezone }) =>
        setWeather({
          temp: Math.round(current.temperature_2m),
          timezone,
          ...getCondition(current.weather_code),
        })
      )
      .catch(() => {});

    return () => controller.abort();
  }, [latitude, longitude]);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  if (!weather) return null;

  return (
    <div className={styles.weather} title={weather.label} {...props}>
      <span aria-hidden>{weather.icon}</span>
      <span>
        {weather.temp}°C in {city} -
      </span>
      <time className={styles.time} dateTime={now.toISOString()}>
        {new Intl.DateTimeFormat(undefined, {
          hour: 'numeric',
          minute: '2-digit',
          timeZone: weather.timezone,
        }).format(now)}
      </time>
    </div>
  );
};
