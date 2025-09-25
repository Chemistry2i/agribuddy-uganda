import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ onToggleSidebar, sidebarExpanded = true, userRole = 'farmer' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigationItems = [
    { 
      label: 'Dashboard', 
      path: '/farmer-dashboard', 
      icon: 'LayoutDashboard',
      roles: ['farmer', 'ngo', 'government']
    },
    { 
      label: 'Disease Detection', 
      path: '/plant-disease-detection', 
      icon: 'Bug',
      roles: ['farmer', 'ngo']
    },
    { 
      label: 'Weather', 
      path: '/weather-dashboard', 
      icon: 'CloudSun',
      roles: ['farmer', 'ngo', 'government']
    },
    { 
      label: 'Crop Management', 
      path: '/crop-management', 
      icon: 'Wheat',
      roles: ['farmer', 'ngo']
    },
    { 
      label: 'Livestock', 
      path: '/livestock-management', 
      icon: 'Cow',
      roles: ['farmer', 'ngo']
    }
  ];

  const visibleNavItems = navigationItems?.filter(item => item?.roles?.includes(userRole))?.slice(0, 4);

  const moreItems = navigationItems?.filter(item => item?.roles?.includes(userRole))?.slice(4);

  const Logo = () => (
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-organic-sm">
        <Icon name="Sprout" size={24} color="white" strokeWidth={2.5} />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-semibold text-foreground">AgriBuddy</span>
        <span className="text-sm text-muted-foreground font-medium">Uganda</span>
      </div>
    </div>
  );

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('selectedLanguage');
    
    // Close the dropdown
    setUserMenuOpen(false);
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-organic-sm">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left Section - Logo and Sidebar Toggle */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="lg:hidden"
          >
            <Icon name="Menu" size={20} />
          </Button>
          <Logo />
        </div>

        {/* Center Section - Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {visibleNavItems?.map((item) => {
            const isActive = location?.pathname === item?.path;
            return (
              <Button
                key={item?.path}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className={`flex items-center space-x-2 px-4 py-2 ${
                  isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => window.location.href = item?.path}
              >
                <Icon name={item?.icon} size={16} />
                <span className="font-medium">{item?.label}</span>
              </Button>
            );
          })}
          
          {moreItems?.length > 0 && (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 px-4 py-2 text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Icon name="MoreHorizontal" size={16} />
                <span className="font-medium">More</span>
              </Button>
              
              {mobileMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-organic-lg z-50">
                  <div className="py-2">
                    {moreItems?.map((item) => (
                      <button
                        key={item?.path}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors"
                        onClick={() => {
                          window.location.href = item?.path;
                          setMobileMenuOpen(false);
                        }}
                      >
                        <Icon name={item?.icon} size={16} />
                        <span>{item?.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Right Section - User Actions */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
          >
            <Icon name="Bell" size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-warning rounded-full"></span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Icon name="MoreVertical" size={20} />
          </Button>

          {/* Desktop User Menu */}
          <div className="hidden lg:block relative">
            <button
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-medium text-foreground">
                  {userRole === 'farmer' ? 'Farmer' : userRole === 'ngo' ? 'NGO Officer' : 'Government Official'}
                </span>
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
              <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
            </button>

            {/* User Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-popover border border-border rounded-lg shadow-organic-lg z-50">
                <div className="py-2">
                  {/* User Info Header */}
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-medium text-popover-foreground">
                      {localStorage.getItem('userEmail') || 'farmer@agribuddy.ug'}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {userRole} Account
                    </p>
                  </div>
                  
                  {/* Menu Items */}
                  <button
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Icon name="Settings" size={16} />
                    <span>Account Settings</span>
                  </button>
                  
                  <button
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Icon name="HelpCircle" size={16} />
                    <span>Help & Support</span>
                  </button>
                  
                  <div className="border-t border-border my-1"></div>
                  
                  {/* Logout Button */}
                  <button
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors"
                    onClick={handleLogout}
                  >
                    <Icon name="LogOut" size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border">
          <nav className="px-4 py-3 space-y-1">
            {navigationItems?.filter(item => item?.roles?.includes(userRole))?.map((item) => {
                const isActive = location?.pathname === item?.path;
                return (
                  <button
                    key={item?.path}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                    onClick={() => {
                      window.location.href = item?.path;
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Icon name={item?.icon} size={18} />
                    <span className="font-medium">{item?.label}</span>
                  </button>
                );
              })}
              
            {/* Mobile Logout Button */}
            <div className="border-t border-border pt-2 mt-2">
              <button
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-error hover:bg-error/10 transition-colors"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
              >
                <Icon name="LogOut" size={18} />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;