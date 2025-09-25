import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ 
  isExpanded = true, 
  onToggle, 
  userRole = 'farmer',
  weatherAlerts = 0 
}) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navigationItems = [
    { 
      label: 'Dashboard', 
      path: '/farmer-dashboard', 
      icon: 'LayoutDashboard',
      roles: ['farmer', 'ngo', 'government'],
      description: 'Overview and quick actions'
    },
    { 
      label: 'Crop Management', 
      path: '/crop-management', 
      icon: 'Wheat',
      roles: ['farmer', 'ngo'],
      description: 'Plan and track your crops'
    },
    { 
      label: 'Livestock', 
      path: '/livestock-management', 
      icon: 'Cow',
      roles: ['farmer', 'ngo'],
      description: 'Manage your animals'
    },
    { 
      label: 'Disease Detection', 
      path: '/plant-disease-detection', 
      icon: 'Bug',
      roles: ['farmer', 'ngo'],
      description: 'AI-powered plant diagnosis'
    },
    { 
      label: 'Weather Intelligence', 
      path: '/weather-dashboard', 
      icon: 'CloudSun',
      roles: ['farmer', 'ngo', 'government'],
      description: 'Forecasts and advisories',
      badge: weatherAlerts > 0 ? weatherAlerts : null
    }
  ];

  const filteredItems = navigationItems?.filter(item => 
    item?.roles?.includes(userRole)
  );

  const Logo = () => (
    <div className={`flex items-center ${isExpanded ? 'space-x-3 px-6' : 'justify-center px-4'} py-4`}>
      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-organic-sm grow-on-hover">
        <Icon name="Sprout" size={24} color="white" strokeWidth={2.5} />
      </div>
      {isExpanded && (
        <div className="flex flex-col animate-fade-in">
          <span className="text-xl font-semibold text-foreground">AgriBuddy</span>
          <span className="text-sm text-muted-foreground font-medium">Uganda</span>
        </div>
      )}
    </div>
  );

  const NavigationItem = ({ item }) => {
    const isActive = location?.pathname === item?.path;
    
    return (
      <div className="relative group">
        <Button
          variant="ghost"
          className={`w-full justify-start h-12 px-4 transition-all duration-200 grow-on-hover ${
            isActive 
              ? 'bg-primary text-primary-foreground shadow-organic-sm' 
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          } ${!isExpanded ? 'px-3' : ''}`}
          onClick={() => window.location.href = item?.path}
        >
          <div className="flex items-center space-x-3 w-full">
            <div className="relative">
              <Icon 
                name={item?.icon} 
                size={20} 
                className={isActive ? 'text-primary-foreground' : ''} 
              />
              {item?.badge && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-warning text-warning-foreground text-xs font-medium rounded-full flex items-center justify-center z-10">
                  {item?.badge}
                </span>
              )}
            </div>
            {isExpanded && (
              <div className="flex flex-col items-start animate-fade-in">
                <span className="font-medium text-sm">{item?.label}</span>
                <span className={`text-xs ${
                  isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'
                }`}>
                  {item?.description}
                </span>
              </div>
            )}
          </div>
        </Button>
        {/* Tooltip for collapsed state */}
        {!isExpanded && (
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-popover border border-border rounded-lg shadow-organic-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
            <div className="flex flex-col">
              <span className="font-medium text-sm text-popover-foreground">{item?.label}</span>
              <span className="text-xs text-muted-foreground">{item?.description}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-organic-lg">
        <nav className="flex items-center justify-around px-2 py-2">
          {filteredItems?.slice(0, 5)?.map((item) => {
            const isActive = location?.pathname === item?.path;
            return (
              <Button
                key={item?.path}
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center space-y-1 px-3 py-2 min-h-[48px] ${
                  isActive 
                    ? 'text-primary' :'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => window.location.href = item?.path}
              >
                <div className="relative">
                  <Icon name={item?.icon} size={18} />
                  {item?.badge && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-warning rounded-full"></span>
                  )}
                </div>
                <span className="text-xs font-medium">{item?.label?.split(' ')?.[0]}</span>
              </Button>
            );
          })}
        </nav>
      </div>
    );
  }

  return (
    <aside 
      className={`fixed left-0 top-0 h-full bg-card border-r border-border shadow-organic-md z-40 transition-all duration-300 ${
        isExpanded ? 'w-80' : 'w-16'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border">
          <Logo />
          {isExpanded && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="mr-4 hover:bg-muted"
            >
              <Icon name="ChevronLeft" size={18} />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 space-y-1">
          <div className={`${isExpanded ? 'px-3' : 'px-2'} space-y-1`}>
            {filteredItems?.map((item) => (
              <NavigationItem key={item?.path} item={item} />
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className={`border-t border-border p-4 ${!isExpanded ? 'px-2' : ''}`}>
          {!isExpanded ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="w-full hover:bg-muted"
            >
              <Icon name="ChevronRight" size={18} />
            </Button>
          ) : (
            <div className="flex items-center space-x-3 animate-fade-in">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-sm font-medium text-foreground">
                  {userRole === 'farmer' ? 'Farmer Account' : 
                   userRole === 'ngo' ? 'NGO Officer' : 'Government Official'}
                </span>
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-muted"
              >
                <Icon name="Settings" size={16} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;