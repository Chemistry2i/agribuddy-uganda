import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import CurrentWeatherCard from './components/CurrentWeatherCard';
import WeatherForecast from './components/WeatherForecast';
import WeatherAlerts from './components/WeatherAlerts';
import WeatherMap from './components/WeatherMap';
import SeasonalCalendar from './components/SeasonalCalendar';
import IrrigationSchedule from './components/IrrigationSchedule';

const WeatherDashboard = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userRole] = useState('farmer');

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

  // Mock current weather data
  const currentWeather = {
    location: "Kampala District, Uganda",
    temperature: 26,
    feelsLike: 29,
    condition: "partly cloudy",
    humidity: 78,
    windSpeed: 12,
    rainfall: 2.5,
    visibility: 8,
    lastUpdated: "2 minutes ago"
  };

  // Mock 7-day forecast data
  const forecast = [
    {
      date: "Today",
      dayName: "Tuesday",
      condition: "partly cloudy",
      description: "Scattered clouds with sunny intervals",
      maxTemp: 28,
      minTemp: 19,
      rainChance: 30,
      agricultureImpact: "good"
    },
    {
      date: "18 Sep",
      dayName: "Wednesday",
      condition: "rainy",
      description: "Light to moderate rainfall expected",
      maxTemp: 24,
      minTemp: 17,
      rainChance: 85,
      agricultureImpact: "excellent"
    },
    {
      date: "19 Sep",
      dayName: "Thursday",
      condition: "cloudy",
      description: "Overcast with possible drizzle",
      maxTemp: 25,
      minTemp: 18,
      rainChance: 45,
      agricultureImpact: "good"
    },
    {
      date: "20 Sep",
      dayName: "Friday",
      condition: "sunny",
      description: "Clear skies and bright sunshine",
      maxTemp: 29,
      minTemp: 20,
      rainChance: 10,
      agricultureImpact: "moderate"
    },
    {
      date: "21 Sep",
      dayName: "Saturday",
      condition: "stormy",
      description: "Thunderstorms with heavy rainfall",
      maxTemp: 23,
      minTemp: 16,
      rainChance: 95,
      agricultureImpact: "poor"
    },
    {
      date: "22 Sep",
      dayName: "Sunday",
      condition: "partly cloudy",
      description: "Mix of sun and clouds",
      maxTemp: 27,
      minTemp: 19,
      rainChance: 25,
      agricultureImpact: "good"
    },
    {
      date: "23 Sep",
      dayName: "Monday",
      condition: "sunny",
      description: "Bright and clear conditions",
      maxTemp: 30,
      minTemp: 21,
      rainChance: 5,
      agricultureImpact: "moderate"
    }
  ];

  // Mock weather alerts data
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "storm",
      severity: "high",
      title: "Thunderstorm Warning",
      description: "Severe thunderstorms expected with heavy rainfall and strong winds. Potential for flooding in low-lying areas.",
      recommendation: "Secure loose farm equipment and ensure proper drainage. Avoid outdoor activities during storm hours.",
      location: "Central Uganda",
      issuedAt: "2 hours ago",
      expiresAt: "Tomorrow 6:00 AM"
    },
    {
      id: 2,
      type: "pest",
      severity: "medium",
      title: "Fall Armyworm Alert",
      description: "Favorable weather conditions for fall armyworm development detected in maize growing areas.",
      recommendation: "Inspect maize crops regularly and apply appropriate pest control measures if needed.",
      location: "Eastern Districts",
      issuedAt: "6 hours ago",
      expiresAt: "Next week"
    },
    {
      id: 3,
      type: "drought",
      severity: "low",
      title: "Dry Spell Advisory",
      description: "Extended period without significant rainfall expected in northern regions.",
      recommendation: "Consider water conservation measures and adjust irrigation schedules accordingly.",
      location: "Northern Uganda",
      issuedAt: "1 day ago",
      expiresAt: "End of month"
    }
  ]);

  // Mock regional weather map data
  const mapData = {
    districts: [
      { id: 1, name: "KLA", temperature: 26, rainfall: 2.5, humidity: 78, windSpeed: 12, alerts: ["Storm Warning"] },
      { id: 2, name: "WKS", temperature: 25, rainfall: 3.2, humidity: 82, windSpeed: 10, alerts: [] },
      { id: 3, name: "MKN", temperature: 24, rainfall: 4.1, humidity: 85, windSpeed: 8, alerts: ["Pest Alert"] },
      { id: 4, name: "EBB", temperature: 27, rainfall: 1.8, humidity: 75, windSpeed: 15, alerts: [] },
      { id: 5, name: "JJA", temperature: 28, rainfall: 2.0, humidity: 70, windSpeed: 14, alerts: [] },
      { id: 6, "name": "MBL", temperature: 22, rainfall: 5.5, humidity: 88, windSpeed: 6, alerts: ["Storm Warning"] },
      { id: 7, name: "GUL", temperature: 31, rainfall: 0.5, humidity: 55, windSpeed: 18, alerts: ["Drought Advisory"] },
      { id: 8, name: "MBR", temperature: 24, rainfall: 3.8, humidity: 80, windSpeed: 9, alerts: [] }
    ],
    averages: {
      temperature: 25.9,
      rainfall: 2.9,
      humidity: 76.6
    },
    alertCount: 3
  };

  // Mock seasonal calendar data
  const seasonalData = {
    months: [
      {
        weather: { avgTemp: 25, minTemp: 18, maxTemp: 30, expectedRainfall: 45, rainyDays: 8, sunshineHours: 7, sunnyDays: 15 },
        activities: [
          { type: "planting", title: "Plant Short Season Maize", crop: "maize", timing: "Early Jan" },
          { type: "harvesting", title: "Coffee Cherry Harvest", crop: "coffee", timing: "All Jan" }
        ]
      },
      // Add more months as needed - showing current month (September)
      {
        weather: { avgTemp: 24, minTemp: 17, maxTemp: 28, expectedRainfall: 120, rainyDays: 15, sunshineHours: 6, sunnyDays: 10 },
        activities: [
          { type: "planting", title: "Plant Season B Crops", crop: "all", timing: "Mid-Late Sep" },
          { type: "fertilizing", title: "Apply Organic Fertilizer", crop: "all", timing: "Early Sep" },
          { type: "pest_control", title: "Monitor for Pests", crop: "all", timing: "All Sep" }
        ]
      }
    ]
  };

  // Mock irrigation schedule data
  const irrigationData = {
    fields: [
      {
        id: 1,
        name: "Field A - Maize",
        soilMoisture: 65,
        nextIrrigation: { date: "Tomorrow", time: "6:00 AM" },
        waterUsage: { today: 450, weekly: 2800 },
        schedule: [
          { id: 1, date: "18 Sep 2024", time: "6:00 AM", duration: "45m", amount: 300, status: "scheduled" },
          { id: 2, date: "20 Sep 2024", time: "6:00 AM", duration: "30m", amount: 200, status: "scheduled" },
          { id: 3, date: "16 Sep 2024", time: "6:00 AM", duration: "45m", amount: 300, status: "completed" }
        ]
      },
      {
        id: 2,
        name: "Field B - Coffee",
        soilMoisture: 45,
        nextIrrigation: { date: "Today", time: "4:00 PM" },
        waterUsage: { today: 280, weekly: 1950 },
        schedule: [
          { id: 1, date: "17 Sep 2024", time: "4:00 PM", duration: "60m", amount: 400, status: "active" },
          { id: 2, date: "19 Sep 2024", time: "6:00 AM", duration: "45m", amount: 350, status: "scheduled" }
        ]
      }
    ],
    weatherForecast: {
      rainfall: 25,
      recommendation: "Reduce irrigation by 30% due to expected rainfall."
    }
  };

  const handleDismissAlert = (alertId) => {
    setAlerts(alerts?.filter(alert => alert?.id !== alertId));
  };

  const handleUpdateSchedule = (fieldId, sessionId, action) => {
    console.log(`Updating irrigation schedule: Field ${fieldId}, Session ${sessionId}, Action: ${action}`);
  };

  useEffect(() => {
    document.title = "Weather Dashboard - AgriBuddy Uganda";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onToggleSidebar={() => setSidebarExpanded(!sidebarExpanded)}
        sidebarExpanded={sidebarExpanded}
        userRole={userRole}
      />
      <Sidebar 
        isExpanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
        userRole={userRole}
        weatherAlerts={alerts?.length}
      />
      <main className={`transition-all duration-300 pt-16 pb-20 lg:pb-6 ${
        isMobile ? 'ml-0' : sidebarExpanded ? 'lg:ml-80' : 'lg:ml-16'
      }`}>
        <div className="p-4 sm:p-6 space-y-6 max-w-8xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Weather Intelligence</h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Hyperlocal weather data and agricultural advisories
              </p>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <CurrentWeatherCard currentWeather={currentWeather} />
              <WeatherForecast forecast={forecast} />
              <WeatherMap mapData={mapData} />
            </div>
            {/* Right Column */}
            <div className="lg:col-span-1 space-y-6">
              <WeatherAlerts alerts={alerts} onDismissAlert={handleDismissAlert} />
              <SeasonalCalendar seasonalData={seasonalData} />
              <IrrigationSchedule 
                irrigationData={irrigationData} 
                onUpdateSchedule={handleUpdateSchedule} 
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WeatherDashboard;