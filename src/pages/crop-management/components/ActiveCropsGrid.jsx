import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const ActiveCropsGrid = ({ crops, onCropSelect, onCropUpdate }) => {
  const [viewMode, setViewMode] = useState('grid');

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

  const getHealthStatus = (health) => {
    const statuses = {
      'Excellent': { color: 'text-success', icon: 'CheckCircle' },
      'Good': { color: 'text-primary', icon: 'Circle' },
      'Fair': { color: 'text-warning', icon: 'AlertCircle' },
      'Poor': { color: 'text-destructive', icon: 'XCircle' }
    };
    return statuses?.[health] || { color: 'text-muted-foreground', icon: 'Circle' };
  };

  const CropCard = ({ crop }) => {
    const healthStatus = getHealthStatus(crop?.health);
    
    return (
      <div 
        className="bg-card border border-border rounded-lg shadow-organic-sm hover:shadow-organic-md transition-all duration-200 cursor-pointer grow-on-hover flex flex-col"
        onClick={() => onCropSelect(crop)}
      >
        <div className="relative">
          <Image
            src={crop?.image}
            alt={crop?.name}
            className="w-full h-40 sm:h-48 object-cover rounded-t-lg"
          />
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getGrowthStageColor(crop?.growthStage)}`}>
              {crop?.growthStage}
            </span>
          </div>
          <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3">
            <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
              <Icon name={healthStatus?.icon} size={14} className={healthStatus?.color} />
              <span className="text-xs text-white font-medium">{crop?.health}</span>
            </div>
          </div>
        </div>
        <div className="p-3 sm:p-4 flex-grow flex flex-col">
          <div className="flex items-start justify-between mb-2 sm:mb-3">
            <div>
              <h3 className="font-semibold text-base sm:text-lg text-foreground mb-1">{crop?.name}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{crop?.variety}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
              <Icon name="MoreVertical" size={16} />
            </Button>
          </div>

          <div className="space-y-2 mb-3 sm:mb-4 text-xs sm:text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Field:</span>
              <span className="text-foreground font-medium">{crop?.field}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Area:</span>
              <span className="text-foreground font-medium">{crop?.area} ha</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Planted:</span>
              <span className="text-foreground font-medium">{crop?.plantedDate}</span>
            </div>
          </div>

          {crop?.nextTask && (
            <div className="bg-muted rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name="Clock" size={14} className="text-warning" />
                <span className="text-xs sm:text-sm font-medium text-foreground">Next Task</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">{crop?.nextTask}</p>
              <p className="text-xs text-muted-foreground mt-1">Due: {crop?.taskDue}</p>
            </div>
          )}

          <div className="flex-grow"></div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-auto">
            <Button variant="outline" size="sm" className="flex-1">
              <Icon name="Camera" size={14} className="mr-1" />
              Photo
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Icon name="Bug" size={14} className="mr-1" />
              Health
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const CropListItem = ({ crop }) => {
    const healthStatus = getHealthStatus(crop?.health);
    
    return (
      <div 
        className="bg-card border border-border rounded-lg p-3 sm:p-4 hover:shadow-organic-sm transition-all duration-200 cursor-pointer"
        onClick={() => onCropSelect(crop)}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-4">
          <div className="flex items-center w-full sm:w-auto mb-3 sm:mb-0">
            <Image
              src={crop?.image}
              alt={crop?.name}
              className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
            />
            <div className="sm:hidden flex-1 min-w-0 ml-3">
              <h3 className="font-semibold text-foreground truncate">{crop?.name}</h3>
              <p className="text-sm text-muted-foreground">{crop?.variety}</p>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="hidden sm:flex items-center justify-between mb-2">
              <h3 className="font-semibold text-foreground truncate">{crop?.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getGrowthStageColor(crop?.growthStage)}`}>
                {crop?.growthStage}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
              <div>
                <span className="text-muted-foreground">Field:</span>
                <span className="text-foreground font-medium ml-1">{crop?.field}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Area:</span>
                <span className="text-foreground font-medium ml-1">{crop?.area} ha</span>
              </div>
              <div>
                <span className="text-muted-foreground">Health:</span>
                <span className={`font-medium ml-1 ${healthStatus?.color}`}>{crop?.health}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Harvest:</span>
                <span className="text-foreground font-medium ml-1">{crop?.expectedHarvest}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-3 sm:mt-0 ml-auto sm:ml-0">
            <Button variant="outline" size="sm">
              <Icon name="Camera" size={14} />
            </Button>
            <Button variant="outline" size="sm">
              <Icon name="Bug" size={14} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Icon name="MoreVertical" size={16} />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Active Crops</h2>
          <p className="text-sm text-muted-foreground mt-1">{crops?.length} crops currently growing</p>
        </div>
        
        <div className="flex items-center space-x-2 mt-3 sm:mt-0">
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8"
            >
              <Icon name="Grid3X3" size={16} />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8"
            >
              <Icon name="List" size={16} />
            </Button>
          </div>
          
          <Button variant="default" size="sm">
            <Icon name="Plus" size={16} className="mr-2" />
            Add Crop
          </Button>
        </div>
      </div>
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {crops?.map((crop) => (
            <CropCard key={crop?.id} crop={crop} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {crops?.map((crop) => (
            <CropListItem key={crop?.id} crop={crop} />
          ))}
        </div>
      )}
      {crops?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Wheat" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Active Crops</h3>
          <p className="text-muted-foreground mb-4">Start by adding your first crop to begin tracking</p>
          <Button variant="default">
            <Icon name="Plus" size={16} className="mr-2" />
            Add Your First Crop
          </Button>
        </div>
      )}
    </div>
  );
};

export default ActiveCropsGrid;