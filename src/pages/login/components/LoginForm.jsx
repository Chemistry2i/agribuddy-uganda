import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const roleOptions = [
    { value: 'farmer', label: 'Farmer', description: 'Individual farmer or farm owner' },
    { value: 'ngo', label: 'NGO Officer', description: 'Agricultural development organization' },
    { value: 'government', label: 'Government Official', description: 'Ministry or district official' }
  ];

  // Mock credentials for different user types
  const mockCredentials = {
    farmer: { email: 'farmer@agribuddy.ug', password: 'farmer123' },
    ngo: { email: 'ngo@agribuddy.ug', password: 'ngo123' },
    government: { email: 'gov@agribuddy.ug', password: 'gov123' }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData?.role) {
      newErrors.role = 'Please select your role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check mock credentials
      const roleCredentials = mockCredentials?.[formData?.role];
      if (formData?.email === roleCredentials?.email && formData?.password === roleCredentials?.password) {
        // Store user data in localStorage
        localStorage.setItem('userRole', formData?.role);
        localStorage.setItem('userEmail', formData?.email);
        localStorage.setItem('isAuthenticated', 'true');
        
        // Navigate to appropriate dashboard
        switch (formData?.role) {
          case 'farmer': navigate('/farmer-dashboard');
            break;
          case 'ngo': navigate('/farmer-dashboard');
            break;
          case 'government': navigate('/farmer-dashboard');
            break;
          default:
            navigate('/farmer-dashboard');
        }
      } else {
        setErrors({
          submit: `Invalid credentials. Use: ${roleCredentials?.email} / ${roleCredentials?.password}`
        });
      }
    } catch (error) {
      setErrors({
        submit: 'Login failed. Please check your connection and try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Role Selection */}
        <Select
          label="Select Your Role"
          description="Choose your account type to access relevant features"
          options={roleOptions}
          value={formData?.role}
          onChange={(value) => handleInputChange('role', value)}
          error={errors?.role}
          required
          placeholder="Choose your role..."
          className="mb-6"
        />

        {/* Email Input */}
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email address"
          value={formData?.email}
          onChange={(e) => handleInputChange('email', e?.target?.value)}
          error={errors?.email}
          required
          className="mb-4"
        />

        {/* Password Input */}
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={formData?.password}
          onChange={(e) => handleInputChange('password', e?.target?.value)}
          error={errors?.password}
          required
          className="mb-6"
        />

        {/* Submit Error */}
        {errors?.submit && (
          <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="AlertCircle" size={20} className="text-error mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-error">Authentication Failed</p>
                <p className="text-sm text-error/80 mt-1">{errors?.submit}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          loading={isLoading}
          disabled={isLoading}
          iconName="LogIn"
          iconPosition="right"
          className="w-full"
        >
          {isLoading ? 'Signing In...' : 'Sign In to AgriBuddy'}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;