import React from 'react';
import Icon from '../../../components/AppIcon';

const WeatherWidget = () => {
  const currentWeather = {
    location: "Kampala, Uganda",
    temperature: 26,
    condition: "Partly Cloudy",
    humidity: 78,
    windSpeed: 12,
    uvIndex: 6,
    icon: "CloudSun"
  };

  const forecast = [
    { day: "Today", high: 28, low: 22, icon: "CloudSun", condition: "Partly Cloudy" },
    { day: "Tomorrow", high: 30, low: 24, icon: "Sun", condition: "Sunny" },
    { day: "Thu", high: 27, low: 21, icon: "CloudRain", condition: "Light Rain" },
    { day: "Fri", high: 25, low: 20, icon: "CloudRain", condition: "Moderate Rain" }
  ];

  const advisories = [
    {
      type: "planting",
      message: "Good conditions for planting maize this week",
      icon: "Sprout",
      priority: "medium"
    },
    {
      type: "irrigation",
      message: "Rain expected Friday - reduce irrigation",
      icon: "Droplets",
      priority: "high"
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg shadow-organic-sm">
      {/* Current Weather Header */}
      <div className="p-4 sm:p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
          <div className="mb-3 sm:mb-0">
            <h2 className="text-lg font-semibold text-foreground">Weather Intelligence</h2>
            <p className="text-sm text-muted-foreground">{currentWeather?.location}</p>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-3xl font-bold text-foreground">{currentWeather?.temperature}°C</div>
            <div className="text-sm text-muted-foreground">{currentWeather?.condition}</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <Icon name="Droplets" size={16} className="text-primary" />
            <span className="text-muted-foreground">Humidity: {currentWeather?.humidity}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Wind" size={16} className="text-primary" />
            <span className="text-muted-foreground">Wind: {currentWeather?.windSpeed} km/h</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Sun" size={16} className="text-primary" />
            <span className="text-muted-foreground">UV: {currentWeather?.uvIndex}</span>
          </div>
        </div>
      </div>
      {/* 4-Day Forecast */}
      <div className="p-4 sm:p-6 border-b border-border">
        <h3 className="text-sm font-medium text-foreground mb-4">4-Day Forecast</h3>
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {forecast?.map((day, index) => (
            <div key={index} className="text-center p-1 bg-muted/30 rounded-lg">
              <div className="text-xs text-muted-foreground mb-2">{day?.day}</div>
              <div className="flex justify-center mb-2">
                <Icon name={day?.icon} size={20} className="text-primary" />
              </div>
              <div className="text-sm font-medium text-foreground">{day?.high}°</div>
              <div className="text-xs text-muted-foreground">{day?.low}°</div>
            </div>
          ))}
        </div>
      </div>
      {/* Agricultural Advisories */}
      <div className="p-4 sm:p-6">
        <h3 className="text-sm font-medium text-foreground mb-4">Agricultural Advisories</h3>
        <div className="space-y-3">
          {advisories?.map((advisory, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                advisory?.priority === 'high' ? 'bg-warning' : 'bg-primary'
              }`}>
                <Icon name={advisory?.icon} size={16} color="white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-foreground">{advisory?.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;