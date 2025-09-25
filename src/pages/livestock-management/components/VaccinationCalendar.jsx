import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VaccinationCalendar = ({ vaccinations, onScheduleVaccination, onMarkComplete }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date()?.getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date()?.getFullYear());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getVaccinationsForDate = (date) => {
    return vaccinations?.filter(vaccination => {
      const vaccinationDate = new Date(vaccination.scheduledDate);
      return vaccinationDate?.toDateString() === date?.toDateString();
    });
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0)?.getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1)?.getDay();
  };

  const isToday = (date) => {
    const today = new Date();
    return date?.toDateString() === today?.toDateString();
  };

  const isPastDue = (date) => {
    const today = new Date();
    today?.setHours(0, 0, 0, 0);
    return date < today;
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days?.push(<div key={`empty-${i}`} className="h-16 sm:h-20"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedYear, selectedMonth, day);
      const dayVaccinations = getVaccinationsForDate(date);
      const isCurrentDay = isToday(date);
      const hasPastDue = dayVaccinations?.some(v => isPastDue(date) && v?.status !== 'completed');

      days?.push(
        <div
          key={day}
          className={`h-16 sm:h-20 border-b border-r border-border p-1 ${
            isCurrentDay ? 'bg-primary/10 border-primary' : 'bg-card hover:bg-muted/50'
          } transition-colors cursor-pointer`}
        >
          <div className={`text-xs sm:text-sm font-medium mb-1 ${isCurrentDay ? 'text-primary' : 'text-foreground'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayVaccinations?.slice(0, 1)?.map((vaccination, index) => (
              <div
                key={index}
                className={`text-xs px-1 py-0.5 rounded truncate ${
                  vaccination?.status === 'completed' ? 'bg-success/20 text-success' :
                  hasPastDue ? 'bg-destructive/20 text-destructive': 'bg-primary/20 text-primary'
                }`}
                title={`${vaccination?.animalName} - ${vaccination?.vaccineType}`}
              >
                <span className="hidden sm:inline">{vaccination?.animalName}</span>
                <span className="sm:hidden">Vacc.</span>
              </div>
            ))}
            {dayVaccinations?.length > 1 && (
              <div className="text-xs text-muted-foreground">
                +{dayVaccinations?.length - 1} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const upcomingVaccinations = vaccinations?.filter(v => {
      const vaccinationDate = new Date(v.scheduledDate);
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return vaccinationDate >= today && vaccinationDate <= nextWeek && v?.status !== 'completed';
    })?.sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));

  return (
    <div className="bg-card border border-border rounded-lg shadow-organic-sm">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div className="flex items-center space-x-3 mb-3 sm:mb-0">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="Calendar" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Vaccination Calendar</h2>
              <p className="text-sm text-muted-foreground">Schedule and track vaccinations</p>
            </div>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={onScheduleVaccination}
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Schedule
          </Button>
        </div>

        {/* Month/Year Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (selectedMonth === 0) {
                setSelectedMonth(11);
                setSelectedYear(selectedYear - 1);
              } else {
                setSelectedMonth(selectedMonth - 1);
              }
            }}
          >
            <Icon name="ChevronLeft" size={16} />
          </Button>
          
          <h3 className="text-base sm:text-lg font-semibold text-foreground">
            {months?.[selectedMonth]} {selectedYear}
          </h3>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (selectedMonth === 11) {
                setSelectedMonth(0);
                setSelectedYear(selectedYear + 1);
              } else {
                setSelectedMonth(selectedMonth + 1);
              }
            }}
          >
            <Icon name="ChevronRight" size={16} />
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="mb-6 border-t border-l border-border rounded-lg overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-0 bg-muted/30">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S']?.map(day => (
              <div key={day} className="text-center text-xs sm:text-sm font-medium text-muted-foreground py-2 border-b border-r border-border">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-0">
            {renderCalendarDays()}
          </div>
        </div>

        {/* Upcoming Vaccinations */}
        {upcomingVaccinations?.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Upcoming This Week</h3>
            <div className="space-y-2">
              {upcomingVaccinations?.map((vaccination, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="Syringe" size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{vaccination?.animalName}</p>
                      <p className="text-xs text-muted-foreground">
                        {vaccination?.vaccineType} • {new Date(vaccination.scheduledDate)?.toLocaleDateString('en-GB')}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMarkComplete(vaccination)}
                    className="w-full sm:w-auto"
                  >
                    Mark Done
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
            <div className="flex items-center space-x-1"><div className="w-3 h-3 bg-primary/20 rounded"></div><span className="text-muted-foreground">Scheduled</span></div>
            <div className="flex items-center space-x-1"><div className="w-3 h-3 bg-success/20 rounded"></div><span className="text-muted-foreground">Completed</span></div>
            <div className="flex items-center space-x-1"><div className="w-3 h-3 bg-destructive/20 rounded"></div><span className="text-muted-foreground">Overdue</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaccinationCalendar;