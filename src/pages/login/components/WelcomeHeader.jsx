import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeHeader = () => {
  const currentHour = new Date()?.getHours();
  let greeting = 'Good Morning';
  let greetingIcon = 'Sunrise';

  if (currentHour >= 12 && currentHour < 17) {
    greeting = 'Good Afternoon';
    greetingIcon = 'Sun';
  } else if (currentHour >= 17) {
    greeting = 'Good Evening';
    greetingIcon = 'Sunset';
  }

  return (
    <div className="text-center space-y-4 mb-8">
      {/* Logo and Brand */}
      <div className="flex items-center justify-center space-x-3 mb-6">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-organic-md grow-on-hover">
          <Icon name="Sprout" size={32} color="white" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col items-start">
          <h1 className="text-3xl font-bold text-foreground">AgriBuddy</h1>
          <p className="text-lg font-medium text-primary">Uganda</p>
        </div>
      </div>
      {/* Greeting */}
      <div className="flex items-center justify-center space-x-2 mb-2">
        <Icon name={greetingIcon} size={20} className="text-warning" />
        <span className="text-lg font-medium text-foreground">{greeting}!</span>
      </div>
      {/* Welcome Message */}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          Welcome Back to Your Farm
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
          Sign in to access your agricultural dashboard, manage crops and livestock, 
          get weather insights, and connect with the farming community.
        </p>
      </div>
      {/* Feature Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 max-w-lg mx-auto">
        {[
          { icon: 'Wheat', label: 'Crop Management' },
          { icon: 'Bug', label: 'Disease Detection' },
          { icon: 'CloudSun', label: 'Weather Intel' },
          { icon: 'Cow', label: 'Livestock Care' }
        ]?.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-3 bg-muted/30 rounded-lg"
          >
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-1">
              <Icon name={feature?.icon} size={16} className="text-primary" />
            </div>
            <span className="text-xs font-medium text-foreground text-center leading-tight">
              {feature?.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WelcomeHeader;