import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const IrrigationSchedule = ({ irrigationData, onUpdateSchedule }) => {
  const [selectedField, setSelectedField] = useState(irrigationData?.fields?.[0]?.id || null);

  const getFieldData = () => {
    return irrigationData?.fields?.find(field => field?.id === selectedField) || irrigationData?.fields?.[0];
  };

  const getMoistureLevel = (level) => {
    if (level >= 80) return { color: 'text-success', bg: 'bg-success', label: 'Optimal' };
    if (level >= 60) return { color: 'text-primary', bg: 'bg-primary', label: 'Good' };
    if (level >= 40) return { color: 'text-warning', bg: 'bg-warning', label: 'Low' };
    return { color: 'text-destructive', bg: 'bg-destructive', label: 'Critical' };
  };

  const getIrrigationStatus = (status) => {
    switch (status) {
      case 'active': return { color: 'text-success', bg: 'bg-success/10', icon: 'Play' };
      case 'scheduled': return { color: 'text-primary', bg: 'bg-primary/10', icon: 'Clock' };
      case 'paused': return { color: 'text-warning', bg: 'bg-warning/10', icon: 'Pause' };
      case 'completed': return { color: 'text-muted-foreground', bg: 'bg-muted/10', icon: 'CheckCircle' };
      default: return { color: 'text-muted-foreground', bg: 'bg-muted/10', icon: 'Circle' };
    }
  };

  const fieldData = getFieldData();
  const moistureInfo = getMoistureLevel(fieldData?.soilMoisture || 0);

  return (
    <div className="bg-card rounded-xl p-4 sm:p-6 shadow-organic-lg border border-border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2 sm:mb-0">Irrigation Schedule</h3>
        <div className="flex items-center space-x-2"><Icon name="Droplets" size={16} className="text-primary" /><span className="text-sm text-muted-foreground">Smart Watering</span></div>
      </div>
      
      <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {irrigationData?.fields?.map((field) => (
          <Button key={field?.id} variant={selectedField === field?.id ? 'default' : 'outline'} size="sm" onClick={() => setSelectedField(field?.id)} className="whitespace-nowrap">{field?.name}</Button>
        ))}
      </div>

      {fieldData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-muted/20 rounded-lg p-3 sm:p-4">
              <div className="flex items-center space-x-2 mb-2"><Icon name="Droplets" size={16} className={moistureInfo?.color} /><span className="text-sm font-medium text-foreground">Soil Moisture</span></div>
              <div className="flex items-center space-x-3"><div className="flex-1"><div className="w-full bg-muted rounded-full h-2"><div className={`h-2 rounded-full ${moistureInfo?.bg}`} style={{ width: `${fieldData?.soilMoisture}%` }}></div></div></div><div className="text-right"><p className="text-lg font-semibold text-foreground">{fieldData?.soilMoisture}%</p><p className={`text-xs ${moistureInfo?.color}`}>{moistureInfo?.label}</p></div></div>
            </div>
            <div className="bg-muted/20 rounded-lg p-3 sm:p-4"><div className="flex items-center space-x-2 mb-2"><Icon name="Calendar" size={16} className="text-primary" /><span className="text-sm font-medium text-foreground">Next Irrigation</span></div><p className="text-lg font-semibold text-foreground">{fieldData?.nextIrrigation?.date}</p><p className="text-xs text-muted-foreground">{fieldData?.nextIrrigation?.time}</p></div>
            <div className="bg-muted/20 rounded-lg p-3 sm:p-4"><div className="flex items-center space-x-2 mb-2"><Icon name="Gauge" size={16} className="text-primary" /><span className="text-sm font-medium text-foreground">Water Usage</span></div><p className="text-lg font-semibold text-foreground">{fieldData?.waterUsage?.today}L</p><p className="text-xs text-muted-foreground">Today • {fieldData?.waterUsage?.weekly}L/week</p></div>
          </div>

          <div className="bg-muted/20 rounded-lg p-3 sm:p-4 mb-6">
            <div className="flex items-center space-x-2 mb-3"><Icon name="CloudRain" size={16} className="text-primary" /><span className="text-sm font-medium text-foreground">Weather-Based Recommendations</span></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><p className="text-xs text-muted-foreground mb-1">Rainfall (Next 3 days)</p><p className="text-sm font-medium text-foreground">{irrigationData?.weatherForecast?.rainfall}mm</p></div>
              <div><p className="text-xs text-muted-foreground mb-1">Recommendation</p><p className="text-sm text-foreground">{irrigationData?.weatherForecast?.recommendation}</p></div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground mb-2 sm:mb-0">Upcoming Schedule</h4>
              <Button variant="outline" size="sm" onClick={() => onUpdateSchedule(fieldData?.id)}><Icon name="Settings" size={14} className="mr-2"/>Adjust</Button>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {fieldData?.schedule?.map((session, index) => {
                const status = getIrrigationStatus(session?.status);
                return (
                  <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex items-center space-x-3 w-full sm:w-auto mb-2 sm:mb-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${status?.bg}`}><Icon name={status?.icon} size={16} className={status?.color} /></div>
                      <div className="flex-grow"><div className="flex items-center space-x-2 mb-1"><p className="text-sm font-medium text-foreground">{session?.date}</p><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${status?.color} ${status?.bg}`}>{session?.status}</span></div><p className="text-xs text-muted-foreground">{session?.time} • {session?.duration} • {session?.amount}L</p></div>
                    </div>
                    <div className="flex items-center space-x-2 self-end sm:self-center">
                      {session?.status === 'scheduled' && <><Button variant="ghost" size="icon" onClick={() => onUpdateSchedule(fieldData?.id, session?.id, 'start')}><Icon name="Play" size={16} /></Button><Button variant="ghost" size="icon" onClick={() => onUpdateSchedule(fieldData?.id, session?.id, 'skip')}><Icon name="SkipForward" size={16} /></Button></>}
                      {session?.status === 'active' && <Button variant="ghost" size="icon" onClick={() => onUpdateSchedule(fieldData?.id, session?.id, 'pause')}><Icon name="Pause" size={16} /></Button>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground mb-2 sm:mb-0">Quick Actions</h4>
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" onClick={() => onUpdateSchedule(fieldData?.id, null, 'manual')} className="flex-1"><Icon name="Play" size={14} className="mr-2"/>Manual</Button>
                <Button variant="outline" size="sm" onClick={() => onUpdateSchedule(fieldData?.id, null, 'emergency')} className="flex-1"><Icon name="Zap" size={14} className="mr-2"/>Emergency</Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default IrrigationSchedule;