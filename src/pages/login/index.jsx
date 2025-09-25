import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeHeader from './components/WelcomeHeader';
import LoginForm from './components/LoginForm';
import SecondaryActions from './components/SecondaryActions';
import TrustSignals from './components/TrustSignals';

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      const userRole = localStorage.getItem('userRole') || 'farmer';
      navigate('/farmer-dashboard');
    }

    // Set language preference if not already set
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (!savedLanguage) {
      localStorage.setItem('selectedLanguage', 'en');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322c55e' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      {/* Main Content */}
      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        {/* Left Panel - Welcome & Branding */}
        <div className="lg:w-1/2 flex flex-col justify-center px-6 py-12 lg:px-12">
          <div className="max-w-lg mx-auto w-full">
            <WelcomeHeader />
            
            {/* Mobile Trust Signals */}
            <div className="lg:hidden mt-8">
              <TrustSignals />
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="lg:w-1/2 flex flex-col justify-center px-6 py-12 lg:px-12 bg-card/50 backdrop-blur-sm border-l border-border/50">
          <div className="max-w-md mx-auto w-full space-y-8">
            {/* Login Form */}
            <div className="bg-card rounded-2xl shadow-organic-lg p-8 border border-border/50">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Sign In to Continue
                </h3>
                <p className="text-sm text-muted-foreground">
                  Access your personalized agricultural dashboard
                </p>
              </div>
              
              <LoginForm />
            </div>

            {/* Secondary Actions */}
            <div className="bg-card/80 rounded-xl p-6 border border-border/30">
              <SecondaryActions />
            </div>

            {/* Desktop Trust Signals */}
            <div className="hidden lg:block">
              <TrustSignals />
            </div>

            {/* Footer */}
            <div className="text-center space-y-2 pt-6 border-t border-border/30">
              <p className="text-xs text-muted-foreground">
                © {new Date()?.getFullYear()} AgriBuddy Uganda. Empowering farmers with technology.
              </p>
              <div className="flex items-center justify-center space-x-4 text-xs">
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </button>
                <span className="text-border">•</span>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </button>
                <span className="text-border">•</span>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;