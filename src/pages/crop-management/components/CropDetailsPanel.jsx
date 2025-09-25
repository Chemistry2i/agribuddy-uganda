import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const CropDetailsPanel = ({ crop, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!crop) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Eye' },
    { id: 'growth', label: 'Growth', icon: 'TrendingUp' },
    { id: 'tasks', label: 'Tasks', icon: 'CheckSquare' },
    { id: 'expenses', label: 'Expenses', icon: 'DollarSign' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' }
  ];

  const getGrowthStageColor = (stage) => {
    const colors = {
      'Seedling': 'bg-success/20 text-success border-success/30',
      'Vegetative': 'bg-primary/20 text-primary border-primary/30',
      'Flowering': 'bg-warning/20 text-warning border-warning/30',
      'Fruiting': 'bg-accent/20 text-accent border-accent/30',
      'Mature': 'bg-secondary/20 text-secondary border-secondary/30',
      'Harvesting': 'bg-destructive/20 text-destructive border-destructive/30'
    };
    return colors?.[stage] || 'bg-muted/20 text-muted-foreground border-muted/30';
  };

  const OverviewTab = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-4 sm:space-y-4">
          <div className="bg-muted rounded-lg p-3 sm:p-4">
            <h4 className="font-medium text-foreground mb-3">Basic Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Crop Type:</span><span className="text-foreground font-medium">{crop?.type}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Variety:</span><span className="text-foreground font-medium">{crop?.variety}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Field:</span><span className="text-foreground font-medium">{crop?.field}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Area:</span><span className="text-foreground font-medium">{crop?.area} ha</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">GPS:</span><span className="text-foreground font-medium">{crop?.coordinates}</span></div>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-3 sm:p-4">
            <h4 className="font-medium text-foreground mb-3">Timeline</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Planted:</span><span className="text-foreground font-medium">{crop?.plantedDate}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Growing:</span><span className="text-foreground font-medium">{crop?.daysGrowing} days</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Harvest:</span><span className="text-foreground font-medium">{crop?.expectedHarvest}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">To Harvest:</span><span className="text-foreground font-medium">{crop?.daysToHarvest} days</span></div>
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-4">
          <div className="bg-muted rounded-lg p-3 sm:p-4">
            <h4 className="font-medium text-foreground mb-3">Current Status</h4>
            <div className="space-y-3 text-sm">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-muted-foreground">Growth Stage:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getGrowthStageColor(crop?.growthStage)}`}>{crop?.growthStage}</span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1"><span className="text-muted-foreground">Health:</span><span className="text-foreground font-medium">{crop?.health}</span></div>
                <div className="w-full bg-border rounded-full h-2"><div className={`h-2 rounded-full ${crop?.health === 'Excellent' ? 'bg-success' : crop?.health === 'Good' ? 'bg-primary' : crop?.health === 'Fair' ? 'bg-warning' : 'bg-destructive'}`} style={{ width: `${crop?.healthScore}%` }}></div></div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1"><span className="text-muted-foreground">Progress:</span><span className="text-foreground font-medium">{crop?.growthProgress}%</span></div>
                <div className="w-full bg-border rounded-full h-2"><div className="h-2 bg-primary rounded-full" style={{ width: `${crop?.growthProgress}%` }}></div></div>
              </div>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-3 sm:p-4">
            <h4 className="font-medium text-foreground mb-3">Environment</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
              <div className="text-center"><Icon name="Thermometer" size={20} className="text-warning mx-auto mb-1" /><div className="text-xs text-muted-foreground">Temp.</div><div className="text-sm font-medium text-foreground">{crop?.temperature}°C</div></div>
              <div className="text-center"><Icon name="Droplets" size={20} className="text-primary mx-auto mb-1" /><div className="text-xs text-muted-foreground">Humidity</div><div className="text-sm font-medium text-foreground">{crop?.humidity}%</div></div>
              <div className="text-center"><Icon name="Gauge" size={20} className="text-accent mx-auto mb-1" /><div className="text-xs text-muted-foreground">Soil pH</div><div className="text-sm font-medium text-foreground">{crop?.soilPH}</div></div>
              <div className="text-center"><Icon name="Zap" size={20} className="text-secondary mx-auto mb-1" /><div className="text-xs text-muted-foreground">Nutrients</div><div className="text-sm font-medium text-foreground">{crop?.nutrients}</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const GrowthTrackingTab = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-muted rounded-lg p-3 sm:p-4">
        <h4 className="font-medium text-foreground mb-4">Growth Timeline</h4>
        <div className="space-y-4">
          {crop?.growthHistory?.map((entry, index) => (
            <div key={index} className="flex items-start space-x-3 sm:space-x-4 pb-4 border-b border-border last:border-b-0">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0"><Icon name="Camera" size={16} color="white" /></div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1"><h5 className="font-medium text-foreground">{entry?.stage}</h5><span className="text-xs sm:text-sm text-muted-foreground">{entry?.date}</span></div>
                <p className="text-sm text-muted-foreground mb-2">{entry?.notes}</p>
                {entry?.image && <Image src={entry?.image} alt={`Growth stage ${entry?.stage}`} className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg" />}
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4"><Icon name="Plus" size={16} className="mr-2" />Add Growth Entry</Button>
      </div>
    </div>
  );

  const TasksTab = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-muted rounded-lg p-3 sm:p-4">
          <h4 className="font-medium text-foreground mb-4">Upcoming Tasks</h4>
          <div className="space-y-3">
            {crop?.upcomingTasks?.map((task, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-card rounded-lg border border-border">
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${task?.priority === 'High' ? 'bg-destructive' : task?.priority === 'Medium' ? 'bg-warning' : 'bg-success'}`}></div>
                <div className="flex-1"><h5 className="font-medium text-foreground text-sm">{task?.task}</h5><p className="text-xs text-muted-foreground">Due: {task?.dueDate}</p></div>
                <Button variant="outline" size="icon" className="h-8 w-8"><Icon name="Check" size={14} /></Button>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-muted rounded-lg p-3 sm:p-4">
          <h4 className="font-medium text-foreground mb-4">Completed Tasks</h4>
          <div className="space-y-3">
            {crop?.completedTasks?.map((task, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-card rounded-lg border border-border opacity-75">
                <Icon name="CheckCircle" size={16} className="text-success flex-shrink-0" />
                <div className="flex-1"><h5 className="font-medium text-foreground text-sm">{task?.task}</h5><p className="text-xs text-muted-foreground">Completed: {task?.completedDate}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const ExpensesTab = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-muted rounded-lg p-3 sm:p-4"><h4 className="font-medium text-foreground mb-1 text-sm">Total Investment</h4><p className="text-xl sm:text-2xl font-bold text-foreground">UGX {crop?.totalInvestment?.toLocaleString()}</p></div>
        <div className="bg-muted rounded-lg p-3 sm:p-4"><h4 className="font-medium text-foreground mb-1 text-sm">Expected Revenue</h4><p className="text-xl sm:text-2xl font-bold text-success">UGX {crop?.expectedRevenue?.toLocaleString()}</p></div>
        <div className="bg-muted rounded-lg p-3 sm:p-4"><h4 className="font-medium text-foreground mb-1 text-sm">Projected Profit</h4><p className="text-xl sm:text-2xl font-bold text-primary">UGX {crop?.projectedProfit?.toLocaleString()}</p></div>
      </div>
      <div className="bg-muted rounded-lg p-3 sm:p-4">
        <h4 className="font-medium text-foreground mb-4">Expense Breakdown</h4>
        <div className="space-y-3">
          {crop?.expenses?.map((expense, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
              <div className="flex items-center space-x-3"><Icon name={expense?.icon} size={16} className="text-muted-foreground" /><div><h5 className="font-medium text-foreground text-sm">{expense?.category}</h5><p className="text-xs text-muted-foreground">{expense?.description}</p></div></div>
              <div className="text-right"><p className="font-medium text-foreground text-sm">UGX {expense?.amount?.toLocaleString()}</p><p className="text-xs text-muted-foreground">{expense?.date}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const AnalyticsTab = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-muted rounded-lg p-3 sm:p-4"><h4 className="font-medium text-foreground mb-4">Yield Prediction</h4><div className="text-center py-6"><div className="text-2xl sm:text-3xl font-bold text-primary mb-2">{crop?.predictedYield}</div><div className="text-sm text-muted-foreground mb-4">Expected yield per hectare</div><div className="w-full bg-border rounded-full h-3"><div className="h-3 bg-primary rounded-full" style={{ width: `${crop?.yieldConfidence}%` }}></div></div><div className="text-sm text-muted-foreground mt-2">{crop?.yieldConfidence}% confidence</div></div></div>
        <div className="bg-muted rounded-lg p-3 sm:p-4"><h4 className="font-medium text-foreground mb-4">Performance Metrics</h4><div className="space-y-4"><div><div className="flex justify-between mb-1"><span className="text-sm text-muted-foreground">Growth Rate</span><span className="text-sm font-medium text-foreground">{crop?.growthRate}</span></div><div className="w-full bg-border rounded-full h-2"><div className="h-2 bg-success rounded-full" style={{ width: '85%' }}></div></div></div><div><div className="flex justify-between mb-1"><span className="text-sm text-muted-foreground">Disease Resistance</span><span className="text-sm font-medium text-foreground">{crop?.diseaseResistance}</span></div><div className="w-full bg-border rounded-full h-2"><div className="h-2 bg-primary rounded-full" style={{ width: '92%' }}></div></div></div><div><div className="flex justify-between mb-1"><span className="text-sm text-muted-foreground">Water Efficiency</span><span className="text-sm font-medium text-foreground">{crop?.waterEfficiency}</span></div><div className="w-full bg-border rounded-full h-2"><div className="h-2 bg-accent rounded-full" style={{ width: '78%' }}></div></div></div></div></div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'growth': return <GrowthTrackingTab />;
      case 'tasks': return <TasksTab />;
      case 'expenses': return <ExpensesTab />;
      case 'analytics': return <AnalyticsTab />;
      default: return <OverviewTab />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-4">
      <div className="bg-card rounded-none sm:rounded-lg shadow-organic-lg w-full h-full sm:w-full sm:max-w-6xl sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border flex-shrink-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Image src={crop?.image} alt={crop?.name} className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg" />
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">{crop?.name}</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">{crop?.variety} • {crop?.field}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}><Icon name="X" size={20} /></Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-border flex-shrink-0">
          <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 overflow-x-auto">
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
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-grow">
          {renderTabContent()}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-t border-border bg-muted/50 flex-shrink-0">
          <div className="flex space-x-2 mb-3 sm:mb-0">
            <Button variant="outline" size="sm"><Icon name="Camera" size={14} className="mr-2" />Photo</Button>
            <Button variant="outline" size="sm"><Icon name="Bug" size={14} className="mr-2" />Health</Button>
            <Button variant="outline" size="sm"><Icon name="CloudSun" size={14} className="mr-2" />Weather</Button>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button variant="default"><Icon name="Save" size={16} className="mr-2" />Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropDetailsPanel;