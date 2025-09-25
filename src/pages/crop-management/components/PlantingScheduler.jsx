import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PlantingScheduler = ({ onScheduleAdd, onClose }) => {
  const [formData, setFormData] = useState({
    cropType: '',
    variety: '',
    field: '',
    area: '',
    plantingDate: '',
    expectedHarvest: '',
    notes: ''
  });

  const cropOptions = [
    { value: 'coffee', label: 'Coffee' },
    { value: 'matooke', label: 'Matooke (Banana)' },
    { value: 'maize', label: 'Maize (Corn)' },
    { value: 'beans', label: 'Beans' },
    { value: 'cassava', label: 'Cassava' },
    { value: 'sweet-potato', label: 'Sweet Potato' }
  ];

  const varietyOptions = {
    coffee: [
      { value: 'arabica-sl28', label: 'Arabica SL28' },
      { value: 'arabica-sl14', label: 'Arabica SL14' },
      { value: 'robusta-clonal', label: 'Robusta Clonal' }
    ],
    matooke: [
      { value: 'mpologoma', label: 'Mpologoma' },
      { value: 'kibuzi', label: 'Kibuzi' },
      { value: 'nakitembe', label: 'Nakitembe' }
    ],
    maize: [
      { value: 'longe-5', label: 'Longe 5' },
      { value: 'longe-10h', label: 'Longe 10H' },
      { value: 'sc-duma-43', label: 'SC Duma 43' }
    ],
    beans: [
      { value: 'kanyebwa', label: 'Kanyebwa' },
      { value: 'masindi-yellow', label: 'Masindi Yellow' },
      { value: 'nabe-4', label: 'NABE 4' }
    ]
  };

  const fieldOptions = [
    { value: 'field-a', label: 'Field A (North Plot)' },
    { value: 'field-b', label: 'Field B (South Plot)' },
    { value: 'field-c', label: 'Field C (East Plot)' },
    { value: 'field-d', label: 'Field D (West Plot)' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-calculate expected harvest date based on crop type
    if (field === 'plantingDate' && formData?.cropType) {
      const plantDate = new Date(value);
      const harvestDays = {
        coffee: 270, // 9 months
        matooke: 365, // 12 months
        maize: 120, // 4 months
        beans: 90, // 3 months
        cassava: 365, // 12 months
        'sweet-potato': 120 // 4 months
      };
      
      const days = harvestDays?.[formData?.cropType] || 120;
      const harvestDate = new Date(plantDate.getTime() + (days * 24 * 60 * 60 * 1000));
      
      setFormData(prev => ({
        ...prev,
        expectedHarvest: harvestDate?.toISOString()?.split('T')?.[0]
      }));
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    onScheduleAdd(formData);
    onClose();
  };

  const getSeasonalRecommendations = () => {
    const currentMonth = new Date()?.getMonth();
    const recommendations = {
      coffee: currentMonth >= 2 && currentMonth <= 4 ? 'Optimal planting season' : 'Consider waiting for rainy season',
      matooke: 'Can be planted year-round with proper irrigation',
      maize: (currentMonth >= 2 && currentMonth <= 4) || (currentMonth >= 8 && currentMonth <= 10) ? 'Good planting season' : 'Wait for next season',
      beans: (currentMonth >= 2 && currentMonth <= 4) || (currentMonth >= 8 && currentMonth <= 10) ? 'Ideal planting time' : 'Off-season planting'
    };
    
    return recommendations?.[formData?.cropType] || 'Check seasonal guidelines';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-4">
      <div className="bg-card rounded-none sm:rounded-lg shadow-organic-lg w-full h-full sm:w-full sm:max-w-2xl sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border flex-shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">Schedule New Planting</h2>
            <p className="text-sm text-muted-foreground mt-1">Plan your next crop cycle</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Select
              label="Crop Type"
              required
              options={cropOptions}
              value={formData?.cropType}
              onChange={(value) => handleInputChange('cropType', value)}
              placeholder="Select crop type"
            />

            <Select
              label="Variety"
              required
              options={varietyOptions?.[formData?.cropType] || []}
              value={formData?.variety}
              onChange={(value) => handleInputChange('variety', value)}
              placeholder="Select variety"
              disabled={!formData?.cropType}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Select
              label="Field Location"
              required
              options={fieldOptions}
              value={formData?.field}
              onChange={(value) => handleInputChange('field', value)}
              placeholder="Select field"
            />

            <Input
              label="Area (hectares)"
              type="number"
              required
              value={formData?.area}
              onChange={(e) => handleInputChange('area', e?.target?.value)}
              placeholder="0.5"
              min="0.1"
              step="0.1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Input
              label="Planting Date"
              type="date"
              required
              value={formData?.plantingDate}
              onChange={(e) => handleInputChange('plantingDate', e?.target?.value)}
              min={new Date()?.toISOString()?.split('T')?.[0]}
            />

            <Input
              label="Expected Harvest Date"
              type="date"
              required
              value={formData?.expectedHarvest}
              onChange={(e) => handleInputChange('expectedHarvest', e?.target?.value)}
              disabled
              description="Auto-calculated based on crop type"
            />
          </div>

          {formData?.cropType && (
            <div className="bg-muted rounded-lg p-3 sm:p-4">
              <div className="flex items-start space-x-3">
                <Icon name="Info" size={20} className="text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground mb-1">Seasonal Recommendation</h4>
                  <p className="text-sm text-muted-foreground">{getSeasonalRecommendations()}</p>
                </div>
              </div>
            </div>
          )}

          <Input
            label="Notes (Optional)"
            type="text"
            value={formData?.notes}
            onChange={(e) => handleInputChange('notes', e?.target?.value)}
            placeholder="Add any special notes or requirements..."
            description="Include soil preparation, fertilizer plans, or other details"
          />

          {/* Planting Guidelines */}
          {formData?.cropType && (
            <div className="bg-muted rounded-lg p-3 sm:p-4">
              <h4 className="font-medium text-foreground mb-3">Planting Guidelines</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Spacing:</span>
                  <span className="text-foreground font-medium ml-2">
                    {formData?.cropType === 'coffee' ? '2m x 2m' :
                     formData?.cropType === 'matooke' ? '3m x 3m' :
                     formData?.cropType === 'maize' ? '75cm x 25cm' :
                     formData?.cropType === 'beans' ? '30cm x 10cm' : 'Varies'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Seed Rate:</span>
                  <span className="text-foreground font-medium ml-2">
                    {formData?.cropType === 'maize' ? '25kg/ha' :
                     formData?.cropType === 'beans' ? '60kg/ha' :
                     formData?.cropType === 'coffee' ? '2000 seedlings/ha' : 'Consult guide'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Soil pH:</span>
                  <span className="text-foreground font-medium ml-2">
                    {formData?.cropType === 'coffee' ? '6.0-6.5' :
                     formData?.cropType === 'matooke' ? '5.5-6.5' :
                     formData?.cropType === 'maize' ? '6.0-7.0' :
                     formData?.cropType === 'beans' ? '6.0-7.0' : '6.0-7.0'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Water Needs:</span>
                  <span className="text-foreground font-medium ml-2">
                    {formData?.cropType === 'coffee' ? 'High' :
                     formData?.cropType === 'matooke' ? 'High' :
                     formData?.cropType === 'maize' ? 'Medium' :
                     formData?.cropType === 'beans' ? 'Medium' : 'Medium'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between p-4 sm:p-6 border-t border-border bg-muted/50 flex-shrink-0">
          <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Calendar" size={16} />
            <span>Schedule will be added to your crop calendar</span>
          </div>
          <div className="flex space-x-2 w-full sm:w-auto">
            <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none">Cancel</Button>
            <Button 
              type="submit" 
              variant="default"
              disabled={!formData?.cropType || !formData?.variety || !formData?.field || !formData?.area || !formData?.plantingDate}
              onClick={handleSubmit}
              className="flex-1 sm:flex-none"
            >
              <Icon name="Plus" size={16} className="mr-2" />
              Schedule
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantingScheduler;