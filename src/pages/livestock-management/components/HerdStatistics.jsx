import React from 'react';
import Icon from '../../../components/AppIcon';

const HerdStatistics = ({ statistics }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    })?.format(amount);
  };

  const getHealthPercentage = (status) => {
    const total = statistics?.totalAnimals;
    const count = statistics?.healthBreakdown?.[status] || 0;
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  const getHealthColor = (status) => {
    switch (status) {
      case 'excellent':
        return 'text-success';
      case 'good':
        return 'text-primary';
      case 'fair':
        return 'text-warning';
      case 'poor':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-organic-sm">
      <div className="p-4 sm:p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="BarChart3" size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Herd Statistics</h2>
            <p className="text-sm text-muted-foreground">Overview of your livestock</p>
          </div>
        </div>

        {/* Total Animals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-primary/5 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Icon name="Users" size={24} className="text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{statistics?.totalAnimals}</p>
                <p className="text-sm text-muted-foreground">Total Animals</p>
              </div>
            </div>
          </div>
          <div className="bg-success/5 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Icon name="DollarSign" size={24} className="text-success" />
              <div>
                <p className="text-lg font-bold text-foreground">{formatCurrency(statistics?.totalValue)}</p>
                <p className="text-sm text-muted-foreground">Total Value</p>
              </div>
            </div>
          </div>
        </div>

        {/* Animal Types Breakdown */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-foreground mb-3">Animal Types</h3>
          <div className="space-y-3">
            {Object.entries(statistics?.animalTypes)?.map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={type === 'cattle' ? 'Cow' : type === 'goat' ? 'Rabbit' : type === 'pig' ? 'PiggyBank' : 'Bird'} 
                    size={16} 
                    className="text-muted-foreground" 
                  />
                  <span className="text-sm text-foreground capitalize">{type}</span>
                </div>
                <span className="text-sm font-medium text-foreground">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Health Status */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-foreground mb-3">Health Status</h3>
          <div className="space-y-3">
            {Object.entries(statistics?.healthBreakdown)?.map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    status === 'excellent' ? 'bg-success' :
                    status === 'good' ? 'bg-primary' :
                    status === 'fair' ? 'bg-warning' : 'bg-destructive'
                  }`}></div>
                  <span className="text-sm text-foreground capitalize">{status}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-foreground">{count}</span>
                  <span className={`text-xs ${getHealthColor(status)}`}>
                    ({getHealthPercentage(status)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Expenses */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-foreground mb-3">This Month</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2"><Icon name="Pill" size={16} className="text-muted-foreground" /><span className="text-sm text-foreground">Medication</span></div>
              <span className="text-sm font-medium text-foreground">{formatCurrency(statistics?.monthlyExpenses?.medication)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2"><Icon name="Wheat" size={16} className="text-muted-foreground" /><span className="text-sm text-foreground">Feed</span></div>
              <span className="text-sm font-medium text-foreground">{formatCurrency(statistics?.monthlyExpenses?.feed)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2"><Icon name="Stethoscope" size={16} className="text-muted-foreground" /><span className="text-sm text-foreground">Veterinary</span></div>
              <span className="text-sm font-medium text-foreground">{formatCurrency(statistics?.monthlyExpenses?.veterinary)}</span>
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Total Expenses</span>
              <span className="text-sm font-bold text-foreground">{formatCurrency(statistics?.monthlyExpenses?.medication + statistics?.monthlyExpenses?.feed + statistics?.monthlyExpenses?.veterinary)}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors">
            <Icon name="Plus" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Add New Animal</span>
          </button>
          <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors">
            <Icon name="FileText" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Generate Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HerdStatistics;