import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import PlantDiseaseDetection from './pages/plant-disease-detection';
import LoginPage from './pages/login';
import FarmerDashboard from './pages/farmer-dashboard';
import LivestockManagement from './pages/livestock-management';
import CropManagement from './pages/crop-management';
import WeatherDashboard from './pages/weather-dashboard';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<CropManagement />} />
        <Route path="/plant-disease-detection" element={<PlantDiseaseDetection />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
        <Route path="/livestock-management" element={<LivestockManagement />} />
        <Route path="/crop-management" element={<CropManagement />} />
        <Route path="/weather-dashboard" element={<WeatherDashboard />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
