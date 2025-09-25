import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickTips = () => {
  const [activeTab, setActiveTab] = useState('photography');

  const photographyTips = [
    { icon: 'Camera', title: 'Good Lighting', description: 'Use natural daylight, avoid shadows and direct sun.' },
    { icon: 'Focus', title: 'Clear Focus', description: 'Ensure the affected plant part is in sharp focus.' },
    { icon: 'Maximize', title: 'Fill the Frame', description: 'Get close so the affected area fills the frame.' },
    { icon: 'Crop', title: 'Multiple Angles', description: 'Take photos from top, bottom, and sides of leaves.' },
    { icon: 'Leaf', title: 'Show Symptoms', description: 'Capture clear images of spots, discoloration, etc.' },
    { icon: 'Zap', title: 'Avoid Blur', description: 'Hold your phone steady to avoid blurry images.' }
  ];

  const identificationTips = [
    { icon: 'Eye', title: 'Early Detection', description: 'Check plants regularly for early signs of disease.' },
    { icon: 'MapPin', title: 'Location Matters', description: 'Note where symptoms appear (leaves, stems, etc.).' },
    { icon: 'Calendar', title: 'Timing is Key', description: 'Record when symptoms first appeared.' },
    { icon: 'Thermometer', title: 'Weather Conditions', description: 'Consider recent weather (humidity, rain, temp).' },
    { icon: 'Users', title: 'Check Nearby Plants', description: 'Look for similar symptoms on neighboring plants.' },
    { icon: 'BookOpen', title: 'Document Everything', description: 'Keep records of symptoms, treatments, and outcomes.' }
  ];

  const treatmentTips = [
    { icon: 'Clock', title: 'Act Quickly', description: 'Start treatment as soon as disease is confirmed.' },
    { icon: 'Droplets', title: 'Follow Instructions', description: 'Use exact dosages and application methods.' },
    { icon: 'Shield', title: 'Protective Gear', description: 'Wear gloves when applying chemical treatments.' },
    { icon: 'Repeat', title: 'Consistent Application', description: 'Follow treatment schedules consistently.' },
    { icon: 'Sun', title: 'Weather Timing', description: 'Apply treatments during calm, dry weather.' },
    { icon: 'TrendingUp', title: 'Monitor Progress', description: 'Track treatment effectiveness and adjust if needed.' }
  ];

  const tabs = [
    { id: 'photography', label: 'Photography', icon: 'Camera', tips: photographyTips },
    { id: 'identification', label: 'Identification', icon: 'Search', tips: identificationTips },
    { id: 'treatment', label: 'Treatment', icon: 'Stethoscope', tips: treatmentTips }
  ];

  const activeTips = tabs?.find(tab => tab?.id === activeTab)?.tips || [];

  return (
    <div className="bg-card rounded-xl border border-border shadow-organic-md">
      <div className="p-4 sm:p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0"><Icon name="Lightbulb" size={20} className="text-accent" /></div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Quick Tips</h2>
            <p className="text-sm text-muted-foreground">Guidance for better disease detection</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 sm:p-6 border-b border-border">
        <div className="flex flex-wrap gap-2">
          {tabs?.map((tab) => (
            <Button key={tab?.id} variant={activeTab === tab?.id ? "default" : "ghost"} size="sm" onClick={() => setActiveTab(tab?.id)} className="flex-shrink-0"><Icon name={tab?.icon} size={14} className="mr-2"/>{tab?.label}</Button>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeTips?.map((tip, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors grow-on-hover">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0"><Icon name={tip?.icon} size={16} className="text-primary" /></div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground mb-1 text-sm">{tip?.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{tip?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-6 border-t border-border bg-muted/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="mb-3 sm:mb-0">
            <h3 className="font-medium text-foreground mb-1">Need More Help?</h3>
            <p className="text-sm text-muted-foreground">Connect with experts for personalized guidance</p>
          </div>
          <div className="flex space-x-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="flex-1"><Icon name="Phone" size={14} className="mr-2"/>Call</Button>
            <Button variant="outline" size="sm" className="flex-1"><Icon name="MessageCircle" size={14} className="mr-2"/>Chat</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickTips;