import React from 'react';
import Icon from '../../../components/AppIcon';

const CurrentWeatherCard = ({ currentWeather }) => {
  const getWeatherIcon = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'sunny': case'clear': return 'Sun';
      case 'cloudy': case'overcast': return 'Cloud';
      case 'rainy': case'rain': return 'CloudRain';
      case 'stormy': return 'CloudLightning';
      default: return 'CloudSun';
    }
  };

  const getWeatherGradient = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'sunny': case'clear': return 'weather-sunny';
      case 'cloudy': case'overcast': return 'weather-cloudy';
      case 'rainy': case'rain': case'stormy': return 'weather-rainy';
      default: return 'weather-sunny';
    }
  };

  return (
    <div className={`${getWeatherGradient(currentWeather?.condition)} rounded-xl p-4 sm:p-6 shadow-organic-lg border border-border`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
        <div className="mb-2 sm:mb-0">
          <h3 className="text-lg font-semibold text-foreground">Current Weather</h3>
          <p className="text-sm text-muted-foreground">{currentWeather?.location}</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xs text-muted-foreground">Last updated</p>
          <p className="text-sm font-medium text-foreground">{currentWeather?.lastUpdated}</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name={getWeatherIcon(currentWeather?.condition)} size={32} className="text-foreground" />
          </div>
          <div>
            <p className="text-3xl font-bold text-foreground">{currentWeather?.temperature}°C</p>
            <p className="text-sm text-muted-foreground capitalize">{currentWeather?.condition}</p>
            <p className="text-xs text-muted-foreground">Feels like {currentWeather?.feelsLike}°C</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-left sm:text-right w-full sm:w-auto">
          <div className="flex items-center sm:justify-end space-x-1"><Icon name="Droplets" size={14} className="text-muted-foreground" /><span className="text-xs text-muted-foreground">Humidity</span></div>
          <p className="text-sm font-semibold text-foreground sm:text-right">{currentWeather?.humidity}%</p>
          
          <div className="flex items-center sm:justify-end space-x-1"><Icon name="Wind" size={14} className="text-muted-foreground" /><span className="text-xs text-muted-foreground">Wind</span></div>
          <p className="text-sm font-semibold text-foreground sm:text-right">{currentWeather?.windSpeed} km/h</p>
          
          <div className="flex items-center sm:justify-end space-x-1"><Icon name="CloudRain" size={14} className="text-muted-foreground" /><span className="text-xs text-muted-foreground">Rainfall</span></div>
          <p className="text-sm font-semibold text-foreground sm:text-right">{currentWeather?.rainfall} mm</p>
          
          <div className="flex items-center sm:justify-end space-x-1"><Icon name="Eye" size={14} className="text-muted-foreground" /><span className="text-xs text-muted-foreground">Visibility</span></div>
          <p className="text-sm font-semibold text-foreground sm:text-right">{currentWeather?.visibility} km</p>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeatherCard;