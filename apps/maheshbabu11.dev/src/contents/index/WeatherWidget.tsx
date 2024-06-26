import React, { useEffect } from 'react';

const WeatherWidget = () => {
  useEffect(() => {
    // Function to dynamically load the weather widget script
    const loadScript = () => {
      const script = document.createElement('script');
      script.src = 'https://weatherwidget.io/js/widget.min.js';
      script.async = true;
      script.id = 'weatherwidget-io-js';
      document.body.appendChild(script);
    };

    // Check if the script is already loaded
    if (!document.getElementById('weatherwidget-io-js')) {
      loadScript();
    }
  }, []);

  return (
    <a
      className="weatherwidget-io"
      href="https://forecast7.com/en/8d8976d61/kollam/"
      data-label_1="KOLLAM"
      data-label_2="WEATHER"
      data-theme="weather_one"
    >
      KOLLAM WEATHER
    </a>
  );
};

export default WeatherWidget;
