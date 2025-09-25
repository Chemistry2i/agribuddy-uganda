import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';

// Import components
import ActiveCropsGrid from './components/ActiveCropsGrid';
import CropCalendar from './components/CropCalendar';
import CropDetailsPanel from './components/CropDetailsPanel';
import PlantingScheduler from './components/PlantingScheduler';
import YieldAnalytics from './components/YieldAnalytics';

const CropManagement = () => {
  const navigate = useNavigate();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('crops');
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [showPlantingScheduler, setShowPlantingScheduler] = useState(false);
  const [showCropDetails, setShowCropDetails] = useState(false);

  // Mock data for active crops
  const [crops, setCrops] = useState([
    {
      id: 1,
      name: "Coffee Field North",
      type: "Coffee",
      variety: "Arabica SL28",
      field: "Field A",
      area: 2.5,
      plantedDate: "2024-03-15",
      expectedHarvest: "2024-12-15",
      daysGrowing: 187,
      daysToHarvest: 88,
      growthStage: "Flowering",
      health: "Excellent",
      healthScore: 92,
      growthProgress: 68,
      image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop",
      coordinates: "0.3476° N, 32.5825° E",
      nextTask: "Apply organic fertilizer",
      taskDue: "2024-09-20",
      temperature: 24,
      humidity: 78,
      soilPH: 6.2,
      nutrients: "Good",
      totalInvestment: 1500000,
      expectedRevenue: 2800000,
      projectedProfit: 1300000,
      predictedYield: "1.2 tons/ha",
      yieldConfidence: 85,
      growthRate: "Above Average",
      diseaseResistance: "High",
      waterEfficiency: "Good",
      growthHistory: [
        {
          stage: "Seedling",
          date: "2024-03-15",
          notes: "Healthy seedlings planted with proper spacing",
          image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop"
        },
        {
          stage: "Vegetative",
          date: "2024-05-20",
          notes: "Strong vegetative growth, good leaf development",
          image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=200&h=200&fit=crop"
        },
        {
          stage: "Flowering",
          date: "2024-08-10",
          notes: "Beautiful white flowers appearing, good pollination",
          image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=200&h=200&fit=crop"
        }
      ],
      upcomingTasks: [
        { task: "Apply organic fertilizer", dueDate: "2024-09-20", priority: "High" },
        { task: "Pest inspection", dueDate: "2024-09-25", priority: "Medium" },
        { task: "Pruning", dueDate: "2024-10-01", priority: "Low" }
      ],
      completedTasks: [
        { task: "Weeding", completedDate: "2024-09-10" },
        { task: "Soil testing", completedDate: "2024-09-05" },
        { task: "Irrigation setup", completedDate: "2024-08-28" }
      ],
      expenses: [
        { category: "Seeds", description: "Arabica SL28 seedlings", amount: 300000, date: "2024-03-10", icon: "Seed" },
        { category: "Fertilizer", description: "Organic compost", amount: 200000, date: "2024-04-15", icon: "Leaf" },
        { category: "Labor", description: "Planting and maintenance", amount: 400000, date: "2024-03-15", icon: "Users" },
        { category: "Tools", description: "Farming equipment", amount: 150000, date: "2024-03-12", icon: "Wrench" }
      ]
    },
    {
      id: 2,
      name: "Matooke Garden",
      type: "Matooke",
      variety: "Mpologoma",
      field: "Field B",
      area: 1.8,
      plantedDate: "2024-01-20",
      expectedHarvest: "2024-10-20",
      daysGrowing: 241,
      daysToHarvest: 34,
      growthStage: "Fruiting",
      health: "Good",
      healthScore: 85,
      growthProgress: 88,
      image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop",
      coordinates: "0.3480° N, 32.5830° E",
      nextTask: "Harvest preparation",
      taskDue: "2024-09-18",
      temperature: 26,
      humidity: 82,
      soilPH: 6.0,
      nutrients: "Excellent",
      totalInvestment: 800000,
      expectedRevenue: 1600000,
      projectedProfit: 800000,
      predictedYield: "15 tons/ha",
      yieldConfidence: 78,
      growthRate: "Good",
      diseaseResistance: "Medium",
      waterEfficiency: "Excellent",
      growthHistory: [
        {
          stage: "Seedling",
          date: "2024-01-20",
          notes: "Strong suckers planted from mother plant",
          image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&h=200&fit=crop"
        },
        {
          stage: "Vegetative",
          date: "2024-04-15",
          notes: "Rapid growth with large healthy leaves",
          image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&h=200&fit=crop"
        }
      ],
      upcomingTasks: [
        { task: "Harvest preparation", dueDate: "2024-09-18", priority: "High" },
        { task: "Market arrangement", dueDate: "2024-09-22", priority: "Medium" }
      ],
      completedTasks: [
        { task: "Mulching", completedDate: "2024-09-08" },
        { task: "Sucker removal", completedDate: "2024-08-30" }
      ],
      expenses: [
        { category: "Suckers", description: "Mpologoma variety", amount: 150000, date: "2024-01-15", icon: "Sprout" },
        { category: "Mulch", description: "Organic mulching material", amount: 100000, date: "2024-02-10", icon: "Leaf" },
        { category: "Labor", description: "Planting and care", amount: 250000, date: "2024-01-20", icon: "Users" }
      ]
    },
    {
      id: 3,
      name: "Maize Plot East",
      type: "Maize",
      variety: "Longe 10H",
      field: "Field C",
      area: 3.2,
      plantedDate: "2024-06-01",
      expectedHarvest: "2024-10-01",
      daysGrowing: 109,
      daysToHarvest: 14,
      growthStage: "Mature",
      health: "Fair",
      healthScore: 72,
      growthProgress: 95,
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop",
      coordinates: "0.3485° N, 32.5835° E",
      nextTask: "Harvest planning",
      taskDue: "2024-09-25",
      temperature: 28,
      humidity: 65,
      soilPH: 6.8,
      nutrients: "Fair",
      totalInvestment: 600000,
      expectedRevenue: 1200000,
      projectedProfit: 600000,
      predictedYield: "4.5 tons/ha",
      yieldConfidence: 92,
      growthRate: "Good",
      diseaseResistance: "Good",
      waterEfficiency: "Fair",
      growthHistory: [
        {
          stage: "Seedling",
          date: "2024-06-01",
          notes: "Good germination rate, uniform emergence",
          image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200&h=200&fit=crop"
        },
        {
          stage: "Vegetative",
          date: "2024-07-15",
          notes: "Strong stalks, good leaf development",
          image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200&h=200&fit=crop"
        }
      ],
      upcomingTasks: [
        { task: "Harvest planning", dueDate: "2024-09-25", priority: "High" },
        { task: "Storage preparation", dueDate: "2024-09-28", priority: "Medium" }
      ],
      completedTasks: [
        { task: "Top dressing", completedDate: "2024-08-15" },
        { task: "Pest control", completedDate: "2024-08-20" }
      ],
      expenses: [
        { category: "Seeds", description: "Longe 10H hybrid seeds", amount: 120000, date: "2024-05-25", icon: "Seed" },
        { category: "Fertilizer", description: "NPK and Urea", amount: 180000, date: "2024-06-01", icon: "Zap" },
        { category: "Labor", description: "Land preparation and planting", amount: 200000, date: "2024-06-01", icon: "Users" }
      ]
    }
  ]);

  const tabs = [
    { id: 'crops', label: 'Active Crops', icon: 'Wheat', count: crops?.length },
    { id: 'calendar', label: 'Crop Calendar', icon: 'Calendar' },
    { id: 'analytics', label: 'Yield Analytics', icon: 'BarChart3' }
  ];

  const handleCropSelect = (crop) => {
    setSelectedCrop(crop);
    setShowCropDetails(true);
  };

  const handleCropUpdate = (updatedCrop) => {
    setCrops(prev => prev?.map(crop => 
      crop?.id === updatedCrop?.id ? updatedCrop : crop
    ));
  };

  const handleScheduleAdd = (scheduleData) => {
    const newCrop = {
      id: crops?.length + 1,
      name: `${scheduleData?.cropType} ${scheduleData?.field}`,
      type: scheduleData?.cropType,
      variety: scheduleData?.variety,
      field: scheduleData?.field,
      area: parseFloat(scheduleData?.area),
      plantedDate: scheduleData?.plantingDate,
      expectedHarvest: scheduleData?.expectedHarvest,
      daysGrowing: 0,
      daysToHarvest: Math.ceil((new Date(scheduleData.expectedHarvest) - new Date(scheduleData.plantingDate)) / (1000 * 60 * 60 * 24)),
      growthStage: "Planned",
      health: "N/A",
      healthScore: 0,
      growthProgress: 0,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
      coordinates: "0.3490° N, 32.5840° E",
      nextTask: "Land preparation",
      taskDue: scheduleData?.plantingDate,
      notes: scheduleData?.notes
    };
    
    setCrops(prev => [...prev, newCrop]);
  };

  const quickActions = [
    {
      title: "Disease Detection",
      description: "AI-powered plant health analysis",
      icon: "Bug",
      color: "bg-destructive/10 text-destructive border-destructive/20",
      action: () => navigate('/plant-disease-detection')
    },
    {
      title: "Weather Forecast",
      description: "Check weather conditions",
      icon: "CloudSun",
      color: "bg-primary/10 text-primary border-primary/20",
      action: () => navigate('/weather-dashboard')
    },
    {
      title: "Add New Crop",
      description: "Schedule new planting",
      icon: "Plus",
      color: "bg-success/10 text-success border-success/20",
      action: () => setShowPlantingScheduler(true)
    },
    {
      title: "Livestock Check",
      description: "Monitor animal health",
      icon: "Cow",
      color: "bg-warning/10 text-warning border-warning/20",
      action: () => navigate('/livestock-management')
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'crops':
        return (
          <ActiveCropsGrid
            crops={crops}
            onCropSelect={handleCropSelect}
            onCropUpdate={handleCropUpdate}
          />
        );
      case 'calendar':
        return (
          <CropCalendar
            crops={crops}
            onCropSelect={handleCropSelect}
            selectedCrop={selectedCrop}
          />
        );
      case 'analytics':
        return <YieldAnalytics crops={crops} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onToggleSidebar={() => setSidebarExpanded(!sidebarExpanded)}
        sidebarExpanded={sidebarExpanded}
        userRole="farmer"
      />
      <Sidebar 
        isExpanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
        userRole="farmer"
      />
      <main className={`transition-all duration-300 ${sidebarExpanded ? 'lg:ml-80' : 'lg:ml-16'} pt-16 pb-20 lg:pb-6`}>
        <div className="p-4 sm:p-6 max-w-8xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Crop Management</h1>
                <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
                  Track and optimize your crop production with smart farming tools
                </p>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-3 mt-4 sm:mt-0">
                <Button 
                  variant="outline"
                  onClick={() => setShowPlantingScheduler(true)}
                  size="sm"
                >
                  <Icon name="Calendar" size={14} className="mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Schedule Planting</span>
                  <span className="inline sm:hidden">Schedule</span>
                </Button>
                <Button variant="default" size="sm">
                  <Icon name="Plus" size={14} className="mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Add Crop</span>
                  <span className="inline sm:hidden">Add</span>
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card border border-border rounded-lg p-3 sm:p-4 shadow-organic-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-success/20 rounded-lg flex items-center justify-center">
                    <Icon name="Wheat" size={18} className="text-success" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-foreground">{crops?.length}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Active Crops</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-3 sm:p-4 shadow-organic-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Icon name="MapPin" size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-foreground">{crops?.reduce((sum, crop) => sum + crop?.area, 0)?.toFixed(1)}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Total Hectares</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-3 sm:p-4 shadow-organic-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-warning/20 rounded-lg flex items-center justify-center">
                    <Icon name="Calendar" size={18} className="text-warning" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-foreground">
                      {crops?.filter(crop => crop?.daysToHarvest <= 30)?.length}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Ready Soon</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-3 sm:p-4 shadow-organic-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                    <Icon name="TrendingUp" size={18} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-foreground">87%</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Avg Health</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions?.map((action, index) => (
                <button
                  key={index}
                  onClick={action?.action}
                  className={`p-3 sm:p-4 rounded-lg border transition-all duration-200 hover:shadow-organic-sm grow-on-hover text-left ${action?.color}`}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                    <Icon name={action?.icon} size={18} />
                    <h3 className="font-medium text-sm sm:text-base">{action?.title}</h3>
                  </div>
                  <p className="text-xs sm:text-sm opacity-80">{action?.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-border mb-6">
            <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto pb-2">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex-shrink-0 flex items-center space-x-2 py-3 sm:py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                  {tab?.count && (
                    <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                      {tab?.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {renderTabContent()}
        </div>
      </main>
      {/* Modals */}
      {showPlantingScheduler && (
        <PlantingScheduler
          onScheduleAdd={handleScheduleAdd}
          onClose={() => setShowPlantingScheduler(false)}
        />
      )}
      {showCropDetails && selectedCrop && (
        <CropDetailsPanel
          crop={selectedCrop}
          onClose={() => {
            setShowCropDetails(false);
            setSelectedCrop(null);
          }}
          onUpdate={handleCropUpdate}
        />
      )}
    </div>
  );
};

export default CropManagement;