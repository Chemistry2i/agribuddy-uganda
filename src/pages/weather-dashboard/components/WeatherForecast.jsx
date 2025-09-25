import React from 'react';
import Icon from '../../../components/AppIcon';

const WeatherForecast = ({ forecast }) => {
  const getWeatherIcon = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'sunny': case'clear': return 'Sun';
      case 'cloudy': case'overcast': return 'Cloud';
      case 'rainy': case'rain': return 'CloudRain';
      case 'stormy': return 'CloudLightning';
      default: return 'CloudSun';
    }
  };

  const getAgricultureImpact = (impact) => {
    switch (impact) {
      case 'excellent': return { color: 'text-success', bg: 'bg-success/10', label: 'Excellent' };
      case 'good': return { color: 'text-primary', bg: 'bg-primary/10', label: 'Good' };
      case 'moderate': return { color: 'text-warning', bg: 'bg-warning/10', label: 'Moderate' };
      case 'poor': return { color: 'text-destructive', bg: 'bg-destructive/10', label: 'Poor' };
      default: return { color: 'text-muted-foreground', bg: 'bg-muted', label: 'Unknown' };
    }
  };

  return (
    <div className="bg-card rounded-xl p-4 sm:p-6 shadow-organic-lg border border-border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2 sm:mb-0">7-Day Forecast</h3>
        <div className="flex items-center space-x-2">
          <Icon name="TrendingUp" size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Agricultural Impact</span>
        </div>
      </div>
      <div className="space-y-4">
        {forecast?.map((day, index) => {
          const impact = getAgricultureImpact(day?.agricultureImpact);
          const isToday = index === 0;
          
          return (
            <div 
              key={day?.date}
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 rounded-lg transition-colors hover:bg-muted/50 ${
                isToday ? 'bg-primary/5 border border-primary/20' : 'bg-muted/20'
              }`}
            >
              <div className="flex items-center space-x-4 w-full sm:w-auto mb-3 sm:mb-0">
                <div className="text-center w-16 sm:min-w-[60px]">
                  <p className={`text-sm font-medium ${isToday ? 'text-primary' : 'text-foreground'}`}>
                    {isToday ? 'Today' : day?.dayName?.slice(0,3)}
                  </p>
                  <p className="text-xs text-muted-foreground">{day?.date}</p>
                </div>
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name={getWeatherIcon(day?.condition)} size={20} className="text-foreground" />
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-medium text-foreground capitalize">{day?.condition}</p>
                  <p className="text-xs text-muted-foreground hidden md:block">{day?.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end space-x-4 sm:space-x-6 w-full sm:w-auto">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Rain</p>
                  <div className="flex items-center space-x-1"><Icon name="CloudRain" size={12} className="text-muted-foreground" /><span className="text-sm font-medium text-foreground">{day?.rainChance}%</span></div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Temp</p>
                  <p className="text-sm font-medium text-foreground">{day?.maxTemp}°/{day?.minTemp}°</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Impact</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${impact?.color} ${impact?.bg}`}>{impact?.label}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherForecast;