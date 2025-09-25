import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WeatherAlerts = ({ alerts, onDismissAlert }) => {
  const getAlertIcon = (type) => {
    switch (type) {
      case 'storm': return 'CloudLightning';
      case 'drought': return 'Sun';
      case 'flood': return 'CloudRain';
      case 'pest': return 'Bug';
      case 'disease': return 'AlertTriangle';
      case 'frost': return 'Snowflake';
      default: return 'AlertCircle';
    }
  };

  const getAlertSeverity = (severity) => {
    switch (severity) {
      case 'critical': return { bg: 'bg-destructive/10', border: 'border-destructive/30', text: 'text-destructive', icon: 'text-destructive' };
      case 'high': return { bg: 'bg-warning/10', border: 'border-warning/30', text: 'text-warning-foreground', icon: 'text-warning' };
      case 'medium': return { bg: 'bg-primary/10', border: 'border-primary/30', text: 'text-primary', icon: 'text-primary' };
      case 'low': return { bg: 'bg-muted/50', border: 'border-muted', text: 'text-muted-foreground', icon: 'text-muted-foreground' };
      default: return { bg: 'bg-muted/50', border: 'border-muted', text: 'text-muted-foreground', icon: 'text-muted-foreground' };
    }
  };

  if (!alerts || alerts?.length === 0) {
    return (
      <div className="bg-card rounded-xl p-4 sm:p-6 shadow-organic-lg border border-border h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Weather Alerts</h3>
          <div className="w-2 h-2 bg-success rounded-full"></div>
        </div>
        <div className="text-center py-8 flex-grow flex flex-col justify-center">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="CheckCircle" size={32} className="text-success" />
          </div>
          <p className="text-sm text-muted-foreground">No active weather alerts</p>
          <p className="text-xs text-muted-foreground mt-1">All conditions are favorable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-4 sm:p-6 shadow-organic-lg border border-border h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Weather Alerts</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">{alerts?.length} active</span>
        </div>
      </div>
      <div className="space-y-4 flex-grow overflow-y-auto -mr-4 pr-4">
        {alerts?.map((alert) => {
          const severity = getAlertSeverity(alert?.severity);
          
          return (
            <div key={alert?.id} className={`p-3 sm:p-4 rounded-lg border ${severity?.bg} ${severity?.border} transition-all hover:shadow-organic-sm`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${severity?.bg}`}>
                    <Icon name={getAlertIcon(alert?.type)} size={16} className={severity?.icon} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 mb-1">
                      <h4 className={`text-sm font-semibold ${severity?.text}`}>{alert?.title}</h4>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${severity?.text} ${severity?.bg} border ${severity?.border}`}>{alert?.severity?.toUpperCase()}</span>
                    </div>
                    <p className="text-sm text-foreground mb-2">{alert?.description}</p>
                    {alert?.recommendation && (
                      <div className="bg-muted/50 rounded-lg p-2 sm:p-3 mb-3">
                        <div className="flex items-start space-x-2">
                          <Icon name="Lightbulb" size={14} className="text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-medium text-foreground mb-1">Recommendation:</p>
                            <p className="text-xs text-muted-foreground">{alert?.recommendation}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1"><Icon name="MapPin" size={12} /><span>{alert?.location}</span></div>
                      <div className="flex items-center space-x-1"><Icon name="Clock" size={12} /><span>{alert?.issuedAt}</span></div>
                      {alert?.expiresAt && <div className="flex items-center space-x-1"><Icon name="Calendar" size={12} /><span>Expires: {alert?.expiresAt}</span></div>}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => onDismissAlert(alert?.id)} className="ml-2 hover:bg-muted h-8 w-8 flex-shrink-0"><Icon name="X" size={16} /></Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherAlerts;