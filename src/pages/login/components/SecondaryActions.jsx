import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SecondaryActions = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇬' },
    { code: 'lg', name: 'Luganda', flag: '🇺🇬', disabled: true },
    { code: 'nyn', name: 'Runyankole', flag: '🇺🇬', disabled: true }
  ];

  const handleForgotPassword = () => {
    // In a real app, this would navigate to forgot password page
    alert('Forgot password functionality will be available soon. Please contact your administrator.');
  };

  const handleCreateAccount = () => {
    // In a real app, this would navigate to registration page
    alert('Account registration is currently managed by your organization administrator. Please contact them for access.');
  };

  const handleLanguageChange = (langCode) => {
    if (langCode === 'en') {
      setSelectedLanguage(langCode);
      localStorage.setItem('selectedLanguage', langCode);
    } else {
      alert('Additional language support coming soon!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Forgot Password & Create Account */}
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleForgotPassword}
          iconName="HelpCircle"
          iconPosition="left"
          className="text-muted-foreground hover:text-foreground"
        >
          Forgot Password?
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleCreateAccount}
          iconName="UserPlus"
          iconPosition="left"
          className="border-primary/20 text-primary hover:bg-primary/5"
        >
          Create Account
        </Button>
      </div>
      {/* Language Selector */}
      <div className="border-t border-border pt-6">
        <div className="flex items-center justify-center space-x-3 mb-3">
          <Icon name="Globe" size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Language</span>
        </div>
        
        <div className="flex items-center justify-center space-x-2">
          {languages?.map((lang) => (
            <button
              key={lang?.code}
              onClick={() => handleLanguageChange(lang?.code)}
              disabled={lang?.disabled}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedLanguage === lang?.code
                  ? 'bg-primary text-primary-foreground'
                  : lang?.disabled
                  ? 'text-muted-foreground/50 cursor-not-allowed'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <span>{lang?.flag}</span>
              <span>{lang?.name}</span>
              {lang?.disabled && (
                <Icon name="Clock" size={12} className="opacity-50" />
              )}
            </button>
          ))}
        </div>
        
        {selectedLanguage !== 'en' && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            Additional languages coming soon
          </p>
        )}
      </div>
      {/* Help & Support */}
      <div className="text-center space-y-2">
        <p className="text-xs text-muted-foreground">
          Need help getting started?
        </p>
        <div className="flex items-center justify-center space-x-4">
          <button className="flex items-center space-x-1 text-xs text-primary hover:text-primary/80 transition-colors">
            <Icon name="Phone" size={12} />
            <span>Call Support</span>
          </button>
          <button className="flex items-center space-x-1 text-xs text-primary hover:text-primary/80 transition-colors">
            <Icon name="MessageCircle" size={12} />
            <span>Live Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecondaryActions;