import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BreedingCalendar = ({ breedingRecords, onScheduleBreeding, onUpdateRecord }) => {
  const [selectedView, setSelectedView] = useState('upcoming'); // upcoming, history, calendar

  const getStatusColor = (status) => {
    switch (status) {
      case 'pregnant':
        return 'bg-success text-success-foreground';
      case 'breeding':
        return 'bg-primary text-primary-foreground';
      case 'ready':
        return 'bg-warning text-warning-foreground';
      case 'resting':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getDaysUntilDelivery = (date) => {
    const today = new Date();
    const deliveryDate = new Date(date);
    const diffTime = deliveryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const upcomingDeliveries = breedingRecords?.filter(record => record?.status === 'pregnant' && record?.expectedDelivery)?.sort((a, b) => new Date(a.expectedDelivery) - new Date(b.expectedDelivery));

  const readyForBreeding = breedingRecords?.filter(record => record?.status === 'ready')?.sort((a, b) => a?.animalName?.localeCompare(b?.animalName));

  const breedingHistory = breedingRecords?.filter(record => record?.lastBreeding)?.sort((a, b) => new Date(b.lastBreeding) - new Date(a.lastBreeding));

  return (
    <div className="bg-card border border-border rounded-lg shadow-organic-sm">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div className="flex items-center space-x-3 mb-3 sm:mb-0">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="Heart" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Breeding Management</h2>
              <p className="text-sm text-muted-foreground">Track breeding cycles and deliveries</p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={onScheduleBreeding}
            className="w-full sm:w-auto"
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Schedule Breeding
          </Button>
        </div>

        {/* View Toggle */}
        <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg">
          <Button
            variant={selectedView === 'upcoming' ? 'default' : 'ghost'}
            size="sm"
            className="flex-1 text-xs sm:text-sm"
            onClick={() => setSelectedView('upcoming')}
          >
            Upcoming
          </Button>
          <Button
            variant={selectedView === 'ready' ? 'default' : 'ghost'}
            size="sm"
            className="flex-1 text-xs sm:text-sm"
            onClick={() => setSelectedView('ready')}
          >
            Ready
          </Button>
          <Button
            variant={selectedView === 'history' ? 'default' : 'ghost'}
            size="sm"
            className="flex-1 text-xs sm:text-sm"
            onClick={() => setSelectedView('history')}
          >
            History
          </Button>
        </div>

        <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
          {/* Upcoming Deliveries */}
          {selectedView === 'upcoming' && (
            upcomingDeliveries?.length > 0 ? (
              upcomingDeliveries?.map((record, index) => {
                const daysUntil = getDaysUntilDelivery(record?.expectedDelivery);
                const isUrgent = daysUntil <= 7;
                
                return (
                  <div key={index} className={`p-3 sm:p-4 rounded-lg border ${
                    isUrgent ? 'bg-warning/5 border-warning/20' : 'bg-muted/30 border-border'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3"><div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0"><Icon name="Baby" size={20} className="text-primary" /></div><div><h3 className="font-medium text-foreground">{record?.animalName}</h3><p className="text-sm text-muted-foreground">ID: {record?.tagId}</p></div></div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record?.status)}`}>Pregnant</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                      <div><p className="text-xs text-muted-foreground">Expected</p><p className="font-medium text-foreground">{new Date(record.expectedDelivery)?.toLocaleDateString('en-GB')}</p></div>
                      <div><p className="text-xs text-muted-foreground">Remaining</p><p className={`font-medium ${isUrgent ? 'text-warning' : 'text-foreground'}`}>{daysUntil} days</p></div>
                    </div>
                    {isUrgent && (
                      <div className="bg-warning/10 border border-warning/20 rounded-lg p-2 mb-3">
                        <div className="flex items-center space-x-2"><Icon name="AlertTriangle" size={14} className="text-warning" /><span className="text-xs font-medium text-warning">Delivery expected soon</span></div>
                      </div>
                    )}
                    <div className="flex space-x-2"><Button variant="outline" size="sm" onClick={() => onUpdateRecord(record)}><Icon name="Edit" size={14} className="mr-2" />Update</Button><Button variant="ghost" size="sm"><Icon name="Calendar" size={14} className="mr-2" />Check</Button></div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8"><Icon name="Baby" size={48} className="text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground">No upcoming deliveries</p></div>
            )
          )}

          {/* Ready for Breeding */}
          {selectedView === 'ready' && (
            readyForBreeding?.length > 0 ? (
              readyForBreeding?.map((record, index) => (
                <div key={index} className="p-3 sm:p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3"><div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0"><Icon name="Heart" size={20} className="text-primary" /></div><div><h3 className="font-medium text-foreground">{record?.animalName}</h3><p className="text-sm text-muted-foreground">ID: {record?.tagId}</p></div></div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record?.status)}`}>Ready</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                    <div><p className="text-xs text-muted-foreground">Age</p><p className="font-medium text-foreground">{record?.age}</p></div>
                    <div><p className="text-xs text-muted-foreground">Last Bred</p><p className="font-medium text-foreground">{record?.lastBreeding ? new Date(record.lastBreeding)?.toLocaleDateString('en-GB') : 'Never'}</p></div>
                  </div>
                  <div className="flex space-x-2"><Button size="sm" onClick={() => onScheduleBreeding(record)}><Icon name="Heart" size={14} className="mr-2" />Schedule</Button><Button variant="outline" size="sm"><Icon name="Stethoscope" size={14} className="mr-2" />Check</Button></div>
                </div>
              ))
            ) : (
              <div className="text-center py-8"><Icon name="Heart" size={48} className="text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground">No animals ready for breeding</p></div>
            )
          )}

          {/* Breeding History */}
          {selectedView === 'history' && (
            breedingHistory?.length > 0 ? (
              breedingHistory?.slice(0, 10)?.map((record, index) => (
                <div key={index} className="p-3 sm:p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3"><div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0"><Icon name="Clock" size={20} className="text-muted-foreground" /></div><div><h3 className="font-medium text-foreground">{record?.animalName}</h3><p className="text-sm text-muted-foreground">Bred on {new Date(record.lastBreeding)?.toLocaleDateString('en-GB')}</p></div></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div><p className="text-xs text-muted-foreground">Partner</p><p className="font-medium text-foreground">{record?.breedingPartner || 'N/A'}</p></div>
                    <div><p className="text-xs text-muted-foreground">Offspring</p><p className="font-medium text-foreground">{record?.offspringCount || 0}</p></div>
                    <div><p className="text-xs text-muted-foreground">Success</p><p className="font-medium text-foreground">{record?.successRate || 'N/A'}%</p></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8"><Icon name="Clock" size={48} className="text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground">No breeding history available</p></div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default BreedingCalendar;