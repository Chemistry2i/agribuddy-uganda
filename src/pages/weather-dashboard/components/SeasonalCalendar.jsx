import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SeasonalCalendar = ({ seasonalData }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date()?.getMonth());
  const [selectedCrop, setSelectedCrop] = useState('all');

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const fullMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const crops = [
    { id: 'all', name: 'All Crops', icon: 'Wheat' },
    { id: 'coffee', name: 'Coffee', icon: 'Coffee' },
    { id: 'matooke', name: 'Matooke', icon: 'Banana' },
    { id: 'maize', name: 'Maize', icon: 'Wheat' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'planting': return 'Sprout';
      case 'harvesting': return 'Scissors';
      case 'irrigation': return 'Droplets';
      case 'fertilizing': return 'Beaker';
      case 'pest_control': return 'Bug';
      case 'pruning': return 'Scissors';
      default: return 'Calendar';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'planting': return 'text-success bg-success/10';
      case 'harvesting': return 'text-warning bg-warning/10';
      case 'irrigation': return 'text-primary bg-primary/10';
      case 'fertilizing': return 'text-secondary bg-secondary/10';
      case 'pest_control': return 'text-destructive bg-destructive/10';
      case 'pruning': return 'text-accent bg-accent/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  const getCurrentMonthData = () => {
    const monthData = seasonalData?.months?.[selectedMonth];
    if (!monthData) return { weather: {}, activities: [] };
    if (selectedCrop === 'all') {
      return monthData;
    }
    return {
      ...monthData,
      activities: monthData?.activities?.filter(activity => 
        activity?.crop === selectedCrop || activity?.crop === 'all'
      )
    };
  };

  const currentMonthData = getCurrentMonthData();

  return (
    <div className="bg-card rounded-xl p-4 sm:p-6 shadow-organic-lg border border-border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2 sm:mb-0">Seasonal Calendar</h3>
        <div className="flex items-center space-x-2">
          <Icon name="Calendar" size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Agricultural Activities</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" size="icon" onClick={() => setSelectedMonth(selectedMonth === 0 ? 11 : selectedMonth - 1)}><Icon name="ChevronLeft" size={16} /></Button>
        <div className="text-center"><h4 className="text-lg sm:text-xl font-semibold text-foreground">{fullMonths?.[selectedMonth]}</h4><p className="text-sm text-muted-foreground">{new Date()?.getFullYear()}</p></div>
        <Button variant="outline" size="icon" onClick={() => setSelectedMonth(selectedMonth === 11 ? 0 : selectedMonth + 1)}><Icon name="ChevronRight" size={16} /></Button>
      </div>

      <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {crops?.map((crop) => (
          <Button key={crop?.id} variant={selectedCrop === crop?.id ? 'default' : 'outline'} size="sm" onClick={() => setSelectedCrop(crop?.id)} className="whitespace-nowrap"><Icon name={crop?.icon} size={14} className="mr-2"/>{crop?.name}</Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-muted/20 rounded-lg p-3 sm:p-4"><div className="flex items-center space-x-2 mb-2"><Icon name="Thermometer" size={16} className="text-primary" /><span className="text-sm font-medium text-foreground">Temperature</span></div><p className="text-lg font-semibold text-foreground">{currentMonthData?.weather?.avgTemp}°C</p><p className="text-xs text-muted-foreground">{currentMonthData?.weather?.minTemp}° - {currentMonthData?.weather?.maxTemp}°</p></div>
        <div className="bg-muted/20 rounded-lg p-3 sm:p-4"><div className="flex items-center space-x-2 mb-2"><Icon name="CloudRain" size={16} className="text-primary" /><span className="text-sm font-medium text-foreground">Rainfall</span></div><p className="text-lg font-semibold text-foreground">{currentMonthData?.weather?.expectedRainfall}mm</p><p className="text-xs text-muted-foreground">{currentMonthData?.weather?.rainyDays} rainy days</p></div>
        <div className="bg-muted/20 rounded-lg p-3 sm:p-4"><div className="flex items-center space-x-2 mb-2"><Icon name="Sun" size={16} className="text-primary" /><span className="text-sm font-medium text-foreground">Sunshine</span></div><p className="text-lg font-semibold text-foreground">{currentMonthData?.weather?.sunshineHours}hrs/day</p><p className="text-xs text-muted-foreground">{currentMonthData?.weather?.sunnyDays} sunny days</p></div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-foreground">Recommended Activities</h4>
        {currentMonthData?.activities?.length > 0 ? (
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {currentMonthData?.activities?.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 sm:p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityColor(activity?.type)}`}><Icon name={getActivityIcon(activity?.type)} size={16} /></div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-1">
                    <h5 className="text-sm font-medium text-foreground">{activity?.title}</h5>
                    <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                      {activity?.crop !== 'all' && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">{crops?.find(c => c?.id === activity?.crop)?.name}</span>}
                      <span className="text-xs text-muted-foreground">{activity?.timing}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 hidden sm:block">{activity?.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8"><Icon name="Calendar" size={32} className="text-muted-foreground mx-auto mb-2" /><p className="text-sm text-muted-foreground">No specific activities for this month</p></div>
        )}
      </div>
    </div>
  );
};

export default SeasonalCalendar;