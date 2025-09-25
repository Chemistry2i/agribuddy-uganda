import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, value, unit, icon, trend, trendValue, color = 'primary', onClick }) => {
  const getTrendIcon = () => {
    if (trend === 'up') return 'TrendingUp';
    if (trend === 'down') return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-success';
    if (trend === 'down') return 'text-destructive';
    return 'text-muted-foreground';
  };

  return (
    <div 
      className={`bg-card border border-border rounded-lg p-6 shadow-organic-sm grow-on-hover cursor-pointer transition-all duration-200 ${
        onClick ? 'hover:shadow-organic-md' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-${color} rounded-lg flex items-center justify-center`}>
          <Icon name={icon} size={24} color="white" strokeWidth={2} />
        </div>
        {trendValue && (
          <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
            <Icon name={getTrendIcon()} size={16} />
            <span className="text-sm font-medium">{trendValue}</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-foreground">{value}</h3>
        <p className="text-sm text-muted-foreground">{unit}</p>
        <p className="text-xs text-muted-foreground font-medium">{title}</p>
      </div>
    </div>
  );
};

export default MetricsCard;