import React, { useEffect } from 'react';

declare global {
  interface Window {
    myWidgetParam: any[];
  }
}

const WeatherWidget = () => {
  useEffect(() => {
    window.myWidgetParam = window.myWidgetParam || [];
    window.myWidgetParam.push({
      id: 12,
      cityid: '1259091',
      appid: 'd1a2fabd13ec0c3744b5d28436c538b5',
      units: 'metric',
      containerid: 'openweathermap-widget-12',
    });

    const script = document.createElement('script');
    script.async = true;
    script.charset = 'utf-8';
    script.src =
      '//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js';
    document.body.appendChild(script);
  }, []);

  return <div id="openweathermap-widget-12"></div>;
};

export default WeatherWidget;
