import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertsPanel = () => {
  const alerts = [
    {
      id: 1,
      type: "pest",
      title: "Fall Armyworm Alert",
      message: "High risk detected in your area. Check maize crops immediately.",
      priority: "high",
      icon: "Bug",
      timestamp: "2 hours ago",
      actionRequired: true
    },
    {
      id: 2,
      type: "vaccination",
      title: "Cattle Vaccination Due",
      message: "5 cattle due for FMD vaccination this week.",
      priority: "medium",
      icon: "Syringe",
      timestamp: "1 day ago",
      actionRequired: true
    },
    {
      id: 3,
      type: "planting",
      title: "Optimal Planting Window",
      message: "Weather conditions ideal for bean planting next week.",
      priority: "low",
      icon: "Calendar",
      timestamp: "3 hours ago",
      actionRequired: false
    },
    {
      id: 4,
      type: "market",
      title: "Coffee Price Surge",
      message: "Coffee prices up 15% - consider selling stored beans.",
      priority: "medium",
      icon: "TrendingUp",
      timestamp: "5 hours ago",
      actionRequired: false
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-primary text-primary-foreground';
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

  return (
    <div className="bg-card border border-border rounded-lg shadow-organic-sm">
      <div className="p-4 sm:p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Urgent Alerts</h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">
              {alerts?.filter(alert => alert?.actionRequired)?.length} require action
            </span>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {alerts?.map((alert) => (
            <div 
              key={alert?.id} 
              className={`border-l-4 ${getPriorityBorder(alert?.priority)} bg-muted/30 rounded-r-lg p-3 sm:p-4 transition-all duration-200 hover:bg-muted/50`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getPriorityColor(alert?.priority)}`}>
                  <Icon name={alert?.icon} size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-foreground truncate">{alert?.title}</h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap sm:ml-2">
                      {alert?.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{alert?.message}</p>
                  
                  {alert?.actionRequired && (
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs h-8"
                      >
                        Take Action
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-xs h-8"
                      >
                        Dismiss
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <Button 
            variant="ghost" 
            className="w-full text-sm"
          >
            <Icon name="Bell" size={16} className="mr-2" />
            View All Notifications
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AlertsPanel;