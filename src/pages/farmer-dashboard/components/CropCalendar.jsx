import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CropCalendar = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date()?.getMonth());
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const cropActivities = {
    0: [ // January
      { crop: 'Coffee', activity: 'Pruning', stage: 'maintenance', icon: 'Scissors', priority: 'high' },
      { crop: 'Matooke', activity: 'Harvesting', stage: 'harvest', icon: 'Package', priority: 'medium' }
    ],
    1: [ // February
      { crop: 'Maize', activity: 'Land Preparation', stage: 'preparation', icon: 'Tractor', priority: 'high' },
      { crop: 'Beans', activity: 'Planting', stage: 'planting', icon: 'Sprout', priority: 'medium' }
    ],
    2: [ // March
      { crop: 'Maize', activity: 'Planting', stage: 'planting', icon: 'Sprout', priority: 'high' },
      { crop: 'Coffee', activity: 'Fertilizing', stage: 'growth', icon: 'Droplets', priority: 'medium' }
    ],
    3: [ // April
      { crop: 'Beans', activity: 'Weeding', stage: 'growth', icon: 'Leaf', priority: 'medium' },
      { crop: 'Matooke', activity: 'Planting', stage: 'planting', icon: 'Sprout', priority: 'high' }
    ],
    4: [ // May
      { crop: 'Maize', activity: 'First Weeding', stage: 'growth', icon: 'Leaf', priority: 'high' },
      { crop: 'Coffee', activity: 'Pest Control', stage: 'maintenance', icon: 'Bug', priority: 'medium' }
    ],
    5: [ // June
      { crop: 'Beans', activity: 'Harvesting', stage: 'harvest', icon: 'Package', priority: 'high' },
      { crop: 'Maize', activity: 'Second Weeding', stage: 'growth', icon: 'Leaf', priority: 'medium' }
    ],
    6: [ // July
      { crop: 'Maize', activity: 'Fertilizer Application', stage: 'growth', icon: 'Droplets', priority: 'high' },
      { crop: 'Coffee', activity: 'Harvesting Begins', stage: 'harvest', icon: 'Package', priority: 'medium' }
    ],
    7: [ // August
      { crop: 'Maize', activity: 'Harvesting', stage: 'harvest', icon: 'Package', priority: 'high' },
      { crop: 'Coffee', activity: 'Peak Harvest', stage: 'harvest', icon: 'Package', priority: 'high' }
    ],
    8: [ // September (Current month)
      { crop: 'Beans', activity: 'Second Season Planting', stage: 'planting', icon: 'Sprout', priority: 'high' },
      { crop: 'Matooke', activity: 'Harvesting', stage: 'harvest', icon: 'Package', priority: 'medium' }
    ],
    9: [ // October
      { crop: 'Coffee', activity: 'Post-Harvest Care', stage: 'maintenance', icon: 'Heart', priority: 'medium' },
      { crop: 'Beans', activity: 'Weeding', stage: 'growth', icon: 'Leaf', priority: 'high' }
    ],
    10: [ // November
      { crop: 'Maize', activity: 'Second Season Planting', stage: 'planting', icon: 'Sprout', priority: 'high' },
      { crop: 'Beans', activity: 'Harvesting', stage: 'harvest', icon: 'Package', priority: 'medium' }
    ],
    11: [ // December
      { crop: 'Coffee', activity: 'Mulching', stage: 'maintenance', icon: 'Layers', priority: 'medium' },
      { crop: 'Matooke', activity: 'Planting', stage: 'planting', icon: 'Sprout', priority: 'high' }
    ]
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'preparation': return 'bg-muted text-muted-foreground';
      case 'planting': return 'bg-primary text-primary-foreground';
      case 'growth': return 'bg-success text-success-foreground';
      case 'harvest': return 'bg-warning text-warning-foreground';
      case 'maintenance': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityBorder = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-destructive';
      case 'medium': return 'border-l-warning';
      case 'low': return 'border-l-primary';
      default: return 'border-l-muted';
    }
  };

  const currentActivities = cropActivities?.[selectedMonth] || [];

  return (
    <div className="bg-card border border-border rounded-lg shadow-organic-sm">
      <div className="p-4 sm:p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground mb-3 sm:mb-0">Crop Calendar</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedMonth(selectedMonth > 0 ? selectedMonth - 1 : 11)}
            >
              <Icon name="ChevronLeft" size={16} />
            </Button>
            <span className="text-sm font-medium text-foreground w-24 sm:w-28 text-center">
              {months?.[selectedMonth]}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedMonth(selectedMonth < 11 ? selectedMonth + 1 : 0)}
            >
              <Icon name="ChevronRight" size={16} />
            </Button>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-4">
          {months?.map((month, index) => (
            <button
              key={month}
              onClick={() => setSelectedMonth(index)}
              className={`text-xs py-2 px-1 sm:px-3 rounded-lg transition-colors truncate ${
                selectedMonth === index
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {month?.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {currentActivities?.length > 0 ? (
            currentActivities?.map((activity, index) => (
              <div 
                key={index}
                className={`border-l-4 ${getPriorityBorder(activity?.priority)} bg-muted/30 rounded-r-lg p-3 sm:p-4 transition-all duration-200 hover:bg-muted/50`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getStageColor(activity?.stage)}`}>
                    <Icon name={activity?.icon} size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-foreground">{activity?.crop}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStageColor(activity?.stage)}`}>
                        {activity?.stage}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity?.activity}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No scheduled activities for {months?.[selectedMonth]}</p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <Button 
            variant="outline" 
            className="w-full"
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Add New Activity
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CropCalendar;