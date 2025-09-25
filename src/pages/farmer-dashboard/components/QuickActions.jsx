import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Disease Detection',
      description: 'AI-powered plant diagnosis',
      icon: 'Camera',
      color: 'bg-destructive',
      path: '/plant-disease-detection',
      urgent: true
    },
    {
      title: 'Animal Health',
      description: 'Check livestock condition',
      icon: 'Heart',
      color: 'bg-success',
      path: '/livestock-management',
      urgent: false
    },
    {
      title: 'Market Prices',
      description: 'Current crop prices',
      icon: 'TrendingUp',
      color: 'bg-warning',
      path: '/market-prices',
      urgent: false
    },
    {
      title: 'Weather Forecast',
      description: 'Extended weather data',
      icon: 'CloudSun',
      color: 'bg-primary',
      path: '/weather-dashboard',
      urgent: false
    },
    {
      title: 'Crop Management',
      description: 'Track crop progress',
      icon: 'Wheat',
      color: 'bg-secondary',
      path: '/crop-management',
      urgent: false
    },
    {
      title: 'Community Forum',
      description: 'Connect with farmers',
      icon: 'Users',
      color: 'bg-accent',
      path: '/community-forum',
      urgent: false
    }
  ];

  const handleActionClick = (path) => {
    // For available routes, navigate directly
    const availableRoutes = ['/plant-disease-detection', '/crop-management', '/livestock-management', '/weather-dashboard'];
    if (availableRoutes?.includes(path)) {
      navigate(path);
    } else {
      // For unavailable routes, show coming soon message
      alert('This feature is coming soon!');
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-organic-sm">
      <div className="p-4 sm:p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
        <p className="text-sm text-muted-foreground">Access your most-used farming tools</p>
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {actions?.map((action, index) => (
            <div
              key={index}
              className="relative group cursor-pointer"
              onClick={() => handleActionClick(action?.path)}
            >
              <div className="bg-muted/30 border border-border rounded-lg p-3 sm:p-4 transition-all duration-200 hover:shadow-organic-md hover:bg-muted/50 grow-on-hover h-full">
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 ${action?.color} rounded-lg flex items-center justify-center shadow-organic-sm flex-shrink-0`}>
                    <Icon name={action?.icon} size={20} color="white" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-sm font-medium text-foreground truncate">{action?.title}</h3>
                      {action?.urgent && (
                        <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{action?.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="w-full"
            >
              <Icon name="Phone" size={16} className="mr-2" />
              Emergency Contacts
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
            >
              <Icon name="BookOpen" size={16} className="mr-2" />
              Farming Guides
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;