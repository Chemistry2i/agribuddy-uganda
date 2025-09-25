import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const YieldAnalytics = ({ crops }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedCrop, setSelectedCrop] = useState('all');

  const periodOptions = [
    { value: '3months', label: 'Last 3 Months' },
    { value: '6months', label: 'Last 6 Months' },
    { value: '1year', label: 'Last Year' },
    { value: '2years', label: 'Last 2 Years' }
  ];

  const cropOptions = [
    { value: 'all', label: 'All Crops' },
    { value: 'coffee', label: 'Coffee' },
    { value: 'matooke', label: 'Matooke' },
    { value: 'maize', label: 'Maize' },
    { value: 'beans', label: 'Beans' }
  ];

  // Mock yield data
  const yieldData = [
    { month: 'Jan', coffee: 1200, matooke: 800, maize: 2500, beans: 600 },
    { month: 'Feb', coffee: 1100, matooke: 850, maize: 2300, beans: 650 },
    { month: 'Mar', coffee: 1300, matooke: 900, maize: 2800, beans: 700 },
    { month: 'Apr', coffee: 1250, matooke: 920, maize: 2600, beans: 680 },
    { month: 'May', coffee: 1400, matooke: 950, maize: 3000, beans: 750 },
    { month: 'Jun', coffee: 1350, matooke: 880, maize: 2900, beans: 720 }
  ];

  const productionTrends = [
    { month: 'Jan', actual: 85, predicted: 80, target: 90 },
    { month: 'Feb', actual: 78, predicted: 82, target: 90 },
    { month: 'Mar', actual: 92, predicted: 88, target: 90 },
    { month: 'Apr', actual: 88, predicted: 85, target: 90 },
    { month: 'May', actual: 95, predicted: 92, target: 90 },
    { month: 'Jun', actual: 91, predicted: 89, target: 90 }
  ];

  const cropDistribution = [
    { name: 'Coffee', value: 35, color: '#22c55e' },
    { name: 'Matooke', value: 28, color: '#16a34a' },
    { name: 'Maize', value: 25, color: '#84cc16' },
    { name: 'Beans', value: 12, color: '#f59e0b' }
  ];

  const performanceMetrics = [
    {
      title: 'Total Yield',
      value: '12.5 tons',
      change: '+8.2%',
      trend: 'up',
      icon: 'TrendingUp',
      color: 'text-success'
    },
    {
      title: 'Avg Quality',
      value: '87%',
      change: '+3.1%',
      trend: 'up',
      icon: 'Star',
      color: 'text-warning'
    },
    {
      title: 'Efficiency',
      value: '91%',
      change: '+5.4%',
      trend: 'up',
      icon: 'Zap',
      color: 'text-primary'
    },
    {
      title: 'Revenue/ha',
      value: 'UGX 2.8M',
      change: '+12.3%',
      trend: 'up',
      icon: 'DollarSign',
      color: 'text-accent'
    }
  ];

  const MetricCard = ({ metric }) => (
    <div className="bg-card border border-border rounded-lg p-3 sm:p-4 shadow-organic-sm">
      <div className="flex items-center justify-between mb-2">
        <Icon name={metric?.icon} size={18} className={metric?.color} />
        <div className={`flex items-center space-x-1 text-xs sm:text-sm ${
          metric?.trend === 'up' ? 'text-success' : 'text-destructive'
        }`}>
          <Icon name={metric?.trend === 'up' ? 'TrendingUp' : 'TrendingDown'} size={14} />
          <span>{metric?.change}</span>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-lg sm:text-2xl font-bold text-foreground">{metric?.value}</p>
        <p className="text-xs sm:text-sm text-muted-foreground">{metric?.title}</p>
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-2 sm:p-3 shadow-organic-md">
          <p className="font-medium text-popover-foreground mb-2 text-sm">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-xs sm:text-sm" style={{ color: entry?.color }}>
              {entry?.name}: {entry?.value} kg
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Yield Analytics</h2>
          <p className="text-sm text-muted-foreground mt-1">Track production performance and trends</p>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3 mt-3 sm:mt-0">
          <Select
            options={cropOptions}
            value={selectedCrop}
            onChange={setSelectedCrop}
            placeholder="Select crop"
            className="w-32 sm:w-40"
          />
          <Select
            options={periodOptions}
            value={selectedPeriod}
            onChange={setSelectedPeriod}
            placeholder="Select period"
            className="w-32 sm:w-40"
          />
          <Button variant="outline" size="sm">
            <Icon name="Download" size={14} className="mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>
      {/* Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {performanceMetrics?.map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </div>
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Yield Comparison Chart */}
        <div className="bg-card border border-border rounded-lg p-4 sm:p-6 shadow-organic-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">Yield by Crop Type</h3>
            <Button variant="ghost" size="icon"><Icon name="MoreHorizontal" size={16} /></Button>
          </div>
          <div className="h-60 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yieldData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="coffee" fill="#22c55e" radius={[2, 2, 0, 0]} />
                <Bar dataKey="matooke" fill="#16a34a" radius={[2, 2, 0, 0]} />
                <Bar dataKey="maize" fill="#84cc16" radius={[2, 2, 0, 0]} />
                <Bar dataKey="beans" fill="#f59e0b" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Production Trends */}
        <div className="bg-card border border-border rounded-lg p-4 sm:p-6 shadow-organic-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">Production Trends</h3>
            <Button variant="ghost" size="icon"><Icon name="MoreHorizontal" size={16} /></Button>
          </div>
          <div className="h-60 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={productionTrends} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="actual" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="predicted" stroke="#84cc16" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="target" stroke="#f59e0b" strokeWidth={2} strokeDasharray="10 5" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Crop Distribution */}
        <div className="bg-card border border-border rounded-lg p-4 sm:p-6 shadow-organic-sm">
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">Crop Distribution</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={cropDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={5} dataKey="value">
                  {cropDistribution?.map((entry, index) => <Cell key={`cell-${index}`} fill={entry?.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {cropDistribution?.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: item?.color }}></div><span className="text-foreground">{item?.name}</span></div>
                <span className="text-muted-foreground">{item?.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Yield Predictions */}
        <div className="bg-card border border-border rounded-lg p-4 sm:p-6 shadow-organic-sm">
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">Yield Predictions</h3>
          <div className="space-y-4">
            {[
              { crop: 'Coffee', current: '1.2 tons', predicted: '1.4 tons', confidence: 85 },
              { crop: 'Matooke', current: '0.9 tons', predicted: '1.0 tons', confidence: 78 },
              { crop: 'Maize', current: '2.8 tons', predicted: '3.2 tons', confidence: 92 },
              { crop: 'Beans', current: '0.7 tons', predicted: '0.8 tons', confidence: 88 }
            ]?.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between"><span className="text-sm font-medium text-foreground">{item?.crop}</span><span className="text-xs text-muted-foreground">{item?.confidence}% conf.</span></div>
                <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Current: {item?.current}</span><span className="text-foreground font-medium">Predicted: {item?.predicted}</span></div>
                <div className="w-full bg-border rounded-full h-2"><div className="h-2 bg-primary rounded-full" style={{ width: `${item?.confidence}%` }}></div></div>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Metrics */}
        <div className="bg-card border border-border rounded-lg p-4 sm:p-6 shadow-organic-sm">
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">Quality Metrics</h3>
          <div className="space-y-4">
            {[
              { metric: 'Grade A Quality', value: 78, color: 'bg-success' },
              { metric: 'Grade B Quality', value: 18, color: 'bg-warning' },
              { metric: 'Grade C Quality', value: 4, color: 'bg-destructive' },
              { metric: 'Moisture Content', value: 12, color: 'bg-primary' },
              { metric: 'Pest Damage', value: 3, color: 'bg-accent' }
            ]?.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between"><span className="text-sm text-foreground">{item?.metric}</span><span className="text-sm font-medium text-foreground">{item?.value}%</span></div>
                <div className="w-full bg-border rounded-full h-2"><div className={`h-2 rounded-full ${item?.color}`} style={{ width: `${item?.value}%` }}></div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Insights and Recommendations */}
      <div className="bg-card border border-border rounded-lg p-4 sm:p-6 shadow-organic-sm">
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">AI Insights & Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-success/10 border border-success/20 rounded-lg">
              <Icon name="TrendingUp" size={20} className="text-success mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground mb-1">Yield Improvement</h4>
                <p className="text-sm text-muted-foreground">Coffee yield has increased by 15% compared to last season. Consider expanding coffee cultivation area.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground mb-1">Attention Needed</h4>
                <p className="text-sm text-muted-foreground">Maize yield is below target. Review soil nutrition and pest management practices.</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <Icon name="Lightbulb" size={20} className="text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground mb-1">Optimization Tip</h4>
                <p className="text-sm text-muted-foreground">Intercropping beans with maize could increase overall land productivity by 20%.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-accent/10 border border-accent/20 rounded-lg">
              <Icon name="Calendar" size={20} className="text-accent mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground mb-1">Seasonal Planning</h4>
                <p className="text-sm text-muted-foreground">Plan next season's planting schedule to optimize harvest timing and market prices.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YieldAnalytics;