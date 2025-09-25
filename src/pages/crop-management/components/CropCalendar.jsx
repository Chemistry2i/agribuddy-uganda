import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const CropCalendar = ({ crops, onCropSelect, selectedCrop }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date()?.getMonth());
  const [currentYear] = useState(new Date()?.getFullYear());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const cropSeasons = {
    coffee: { plant: [2, 3], harvest: [9, 10, 11] },
    matooke: { plant: [2, 3, 8, 9], harvest: [0, 1, 6, 7] },
    maize: { plant: [2, 3, 8, 9], harvest: [6, 7, 0, 1] },
    beans: { plant: [2, 3, 8, 9], harvest: [5, 6, 11, 0] }
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0)?.getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1)?.getDay();
  };

  const getCropActivities = (day, month) => {
    const activities = [];
    crops?.forEach(crop => {
      const season = cropSeasons?.[crop?.type?.toLowerCase()];
      if (season) {
        if (season?.plant?.includes(month)) {
          activities?.push({ type: 'plant', crop: crop?.name, color: 'bg-success' });
        }
        if (season?.harvest?.includes(month)) {
          activities?.push({ type: 'harvest', crop: crop?.name, color: 'bg-warning' });
        }
      }
    });
    return activities;
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      setCurrentMonth(currentMonth === 0 ? 11 : currentMonth - 1);
    } else {
      setCurrentMonth(currentMonth === 11 ? 0 : currentMonth + 1);
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days?.push(<div key={`empty-${i}`} className="h-16 sm:h-20 border-b border-r border-border"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const activities = getCropActivities(day, currentMonth);
      const isToday = new Date()?.getDate() === day && new Date()?.getMonth() === currentMonth;

      days?.push(
        <div
          key={day}
          className={`h-16 sm:h-20 border-b border-r border-border p-1 hover:bg-muted transition-colors cursor-pointer ${
            isToday ? 'bg-accent/20 border-accent' : ''
          }`}
        >
          <div className={`text-xs sm:text-sm font-medium mb-1 ${isToday ? 'text-accent' : 'text-foreground'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {activities?.slice(0, 2)?.map((activity, index) => (
              <div
                key={index}
                className={`text-xs px-1 py-0.5 rounded text-white truncate ${activity?.color}`}
                title={`${activity?.type} ${activity?.crop}`}
              >
                <span className="hidden sm:inline">{activity?.type === 'plant' ? '🌱' : '🌾'}</span> {activity?.crop?.substring(0, 6)}
              </div>
            ))}
            {activities?.length > 2 && (
              <div className="text-xs text-muted-foreground">+{activities?.length - 2} more</div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-organic-sm">
      <div className="p-4 sm:p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground mb-3 sm:mb-0">Crop Calendar</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              <Icon name="ChevronLeft" size={16} />
            </Button>
            <span className="text-sm font-medium text-foreground w-28 sm:w-32 text-center">
              {months?.[currentMonth]} {currentYear}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              <Icon name="ChevronRight" size={16} />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded"></div>
            <span className="text-muted-foreground">Planting Season</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded"></div>
            <span className="text-muted-foreground">Harvest Season</span>
          </div>
        </div>
      </div>
      <div className="p-2 sm:p-6">
        {/* Calendar Header */}
        <div className="grid grid-cols-7 gap-0 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S']?.map((day, i) => (
            <div key={i} className="h-8 flex items-center justify-center text-xs sm:text-sm font-medium text-muted-foreground border-b border-border">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-0 border-t border-l border-border rounded-lg overflow-hidden">
          {renderCalendarDays()}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Icon name="Plus" size={16} className="mr-2" />
            Schedule
          </Button>
          <Button variant="outline" size="sm">
            <Icon name="Calendar" size={16} className="mr-2" />
            Reminder
          </Button>
          <Button variant="outline" size="sm">
            <Icon name="Download" size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CropCalendar;