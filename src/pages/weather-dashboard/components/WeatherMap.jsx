import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WeatherMap = ({ mapData }) => {
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [mapView, setMapView] = useState('temperature'); // temperature, rainfall, humidity

  const getMapViewIcon = (view) => {
    switch (view) {
      case 'temperature': return 'Thermometer';
      case 'rainfall': return 'CloudRain';
      case 'humidity': return 'Droplets';
      default: return 'Map';
    }
  };

  const getDistrictColor = (district, view) => {
    const value = district?.[view];
    switch (view) {
      case 'temperature':
        if (value >= 30) return 'bg-red-500';
        if (value >= 25) return 'bg-orange-500';
        if (value >= 20) return 'bg-yellow-500';
        return 'bg-blue-500';
      case 'rainfall':
        if (value >= 50) return 'bg-blue-600';
        if (value >= 25) return 'bg-blue-400';
        if (value >= 10) return 'bg-blue-200';
        return 'bg-gray-300';
      case 'humidity':
        if (value >= 80) return 'bg-teal-600';
        if (value >= 60) return 'bg-teal-400';
        if (value >= 40) return 'bg-teal-200';
        return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  const getValueUnit = (view) => {
    switch (view) {
      case 'temperature': return '°C';
      case 'rainfall': return 'mm';
      case 'humidity': return '%';
      default: return '';
    }
  };

  return (
    <div className="bg-card rounded-xl p-4 sm:p-6 shadow-organic-lg border border-border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-3 sm:mb-0">Regional Weather Map</h3>
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 -mx-2 px-2">
          <Button variant={mapView === 'temperature' ? 'default' : 'outline'} size="sm" onClick={() => setMapView('temperature')} className="whitespace-nowrap"><Icon name="Thermometer" size={14} className="mr-2"/>Temp</Button>
          <Button variant={mapView === 'rainfall' ? 'default' : 'outline'} size="sm" onClick={() => setMapView('rainfall')} className="whitespace-nowrap"><Icon name="CloudRain" size={14} className="mr-2"/>Rain</Button>
          <Button variant={mapView === 'humidity' ? 'default' : 'outline'} size="sm" onClick={() => setMapView('humidity')} className="whitespace-nowrap"><Icon name="Droplets" size={14} className="mr-2"/>Humidity</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Visualization */}
        <div className="lg:col-span-2">
          <div className="bg-muted/20 rounded-lg p-2 sm:p-4 h-64 sm:h-80 relative overflow-hidden">
            <div className="absolute inset-0"><iframe width="100%" height="100%" loading="lazy" title="Uganda Weather Map" referrerPolicy="no-referrer-when-downgrade" src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d4085328.680924379!2d32.2903!3d1.3733!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sug!4v1663333333333" className="rounded-lg"></iframe></div>
            <div className="absolute inset-2 sm:inset-4 grid grid-cols-4 grid-rows-2 gap-1 sm:gap-2 pointer-events-none">
              {mapData?.districts?.map((district) => (
                <div
                  key={district?.id}
                  className={`${getDistrictColor(district, mapView)} rounded-lg opacity-70 hover:opacity-90 transition-opacity cursor-pointer pointer-events-auto flex items-center justify-center p-1`}
                  onClick={() => setSelectedDistrict(district)}
                >
                  <div className="text-center text-white text-xs font-medium">
                    <p className="font-bold">{district?.name}</p>
                    <p>{district?.[mapView]}{getValueUnit(mapView)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center space-x-4 sm:space-x-6">
            <div className="flex items-center space-x-2"><Icon name={getMapViewIcon(mapView)} size={16} className="text-muted-foreground" /><span className="text-sm font-medium text-foreground capitalize">{mapView}</span></div>
            <div className="flex items-center space-x-2"><div className="flex space-x-1"><div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-200 rounded"></div><div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-400 rounded"></div><div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded"></div></div><span className="text-xs text-muted-foreground">Low to High</span></div>
          </div>
        </div>

        {/* District Details */}
        <div className="space-y-4">
          <div className="bg-muted/20 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-foreground mb-3">District Details</h4>
            {selectedDistrict ? (
              <div className="space-y-3">
                <div>
                  <div className="flex items-center space-x-2 mb-2"><Icon name="MapPin" size={16} className="text-primary" /><span className="text-sm font-medium text-foreground">{selectedDistrict?.name}</span></div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><p className="text-muted-foreground">Temp</p><p className="font-medium text-foreground">{selectedDistrict?.temperature}°C</p></div>
                    <div><p className="text-muted-foreground">Rain</p><p className="font-medium text-foreground">{selectedDistrict?.rainfall}mm</p></div>
                    <div><p className="text-muted-foreground">Humidity</p><p className="font-medium text-foreground">{selectedDistrict?.humidity}%</p></div>
                    <div><p className="text-muted-foreground">Wind</p><p className="font-medium text-foreground">{selectedDistrict?.windSpeed}km/h</p></div>
                  </div>
                </div>
                {selectedDistrict?.alerts && selectedDistrict?.alerts?.length > 0 && (
                  <div className="pt-3 border-t border-border"><p className="text-xs font-medium text-foreground mb-2">Active Alerts:</p><div className="space-y-1">{selectedDistrict?.alerts?.map((alert, index) => <div key={index} className="flex items-center space-x-2"><div className="w-2 h-2 bg-warning rounded-full"></div><span className="text-xs text-muted-foreground">{alert}</span></div>)}</div></div>
                )}
              </div>
            ) : (
              <div className="text-center py-4"><Icon name="MousePointer" size={24} className="text-muted-foreground mx-auto mb-2" /><p className="text-xs text-muted-foreground">Click on a district to view details</p></div>
            )}
          </div>
          <div className="bg-muted/20 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-foreground mb-3">Regional Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center"><span className="text-xs text-muted-foreground">Avg Temp</span><span className="text-xs font-medium text-foreground">{mapData?.averages?.temperature}°C</span></div>
              <div className="flex justify-between items-center"><span className="text-xs text-muted-foreground">Total Rain</span><span className="text-xs font-medium text-foreground">{mapData?.averages?.rainfall}mm</span></div>
              <div className="flex justify-between items-center"><span className="text-xs text-muted-foreground">Avg Humidity</span><span className="text-xs font-medium text-foreground">{mapData?.averages?.humidity}%</span></div>
              <div className="flex justify-between items-center"><span className="text-xs text-muted-foreground">Alerts</span><span className="text-xs font-medium text-warning">{mapData?.alertCount} districts</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherMap;