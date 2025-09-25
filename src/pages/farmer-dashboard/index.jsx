import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import MetricsCard from './components/MetricsCard';
import WeatherWidget from './components/WeatherWidget';
import AlertsPanel from './components/AlertsPanel';
import CropCalendar from './components/CropCalendar';
import QuickActions from './components/QuickActions';
import CommunityActivity from './components/CommunityActivity';
import ExtensionContacts from './components/ExtensionContacts';

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      const largeScreen = window.innerWidth >= 1024;
      setIsMobile(mobile);
      setSidebarExpanded(largeScreen);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Mock dashboard metrics data
  const dashboardMetrics = [
    {
      title: 'Active Crops',
      value: '12',
      unit: 'varieties planted',
      icon: 'Wheat',
      trend: 'up',
      trendValue: '+2 this month',
      color: 'primary',
      onClick: () => navigate('/crop-management')
    },
    {
      title: 'Livestock Count',
      value: '45',
      unit: 'animals healthy',
      icon: 'Cow',
      trend: 'stable',
      trendValue: 'No change',
      color: 'success',
      onClick: () => navigate('/livestock-management')
    },
    {
      title: 'Weather Alerts',
      value: '3',
      unit: 'active warnings',
      icon: 'CloudRain',
      trend: 'up',
      trendValue: '+1 today',
      color: 'warning',
      onClick: () => navigate('/weather-dashboard')
    },
    {
      title: 'Market Prices',
      value: 'UGX 2,500',
      unit: 'per kg coffee',
      icon: 'TrendingUp',
      trend: 'up',
      trendValue: '+15% this week',
      color: 'secondary'
    }
  ];

  const handleToggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header 
        onToggleSidebar={handleToggleSidebar}
        sidebarExpanded={sidebarExpanded}
        userRole="farmer"
      />
      {/* Sidebar */}
      <Sidebar 
        isExpanded={sidebarExpanded}
        onToggle={handleToggleSidebar}
        userRole="farmer"
        weatherAlerts={3}
      />
      {/* Main Content */}
      <main 
        className={`transition-all duration-300 ${
          isMobile ? 'ml-0 pb-20' : sidebarExpanded ? 'lg:ml-80' : 'lg:ml-16'
        } pt-16`}
      >
        <div className="p-4 sm:p-6 max-w-8xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Welcome back, Farmer! 🌱
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Here's what's happening on your farm today - {new Date()?.toLocaleDateString('en-GB', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {dashboardMetrics?.map((metric, index) => (
              <MetricsCard
                key={index}
                title={metric?.title}
                value={metric?.value}
                unit={metric?.unit}
                icon={metric?.icon}
                trend={metric?.trend}
                trendValue={metric?.trendValue}
                color={metric?.color}
                onClick={metric?.onClick}
              />
            ))}
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            {/* Left Column - Weather & Alerts */}
            <div className="xl:col-span-1 space-y-8">
              <WeatherWidget />
              <AlertsPanel />
            </div>

            {/* Middle Column - Calendar & Actions */}
            <div className="xl:col-span-1 space-y-8">
              <CropCalendar />
              <QuickActions />
            </div>

            {/* Right Column - Community & Contacts */}
            <div className="xl:col-span-1 space-y-8">
              <CommunityActivity />
              <ExtensionContacts />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FarmerDashboard;