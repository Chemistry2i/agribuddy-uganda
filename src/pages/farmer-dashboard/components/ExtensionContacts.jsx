import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const ExtensionContacts = () => {
  const contacts = [
    {
      id: 1,
      name: "Dr. Peter Ssemakula",
      title: "Senior Agricultural Officer",
      department: "Ministry of Agriculture",
      location: "Kampala District",
      phone: "+256 700 123 456",
      email: "p.ssemakula@agriculture.go.ug",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      specialization: "Crop Management",
      availability: "online",
      lastActive: "2 hours ago"
    },
    {
      id: 2,
      name: "Dr. Grace Nakamya",
      title: "Veterinary Officer",
      department: "Animal Health Division",
      location: "Mukono District",
      phone: "+256 701 234 567",
      email: "g.nakamya@agriculture.go.ug",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
      specialization: "Livestock Health",
      availability: "busy",
      lastActive: "30 minutes ago"
    },
    {
      id: 3,
      name: "John Mukasa",
      title: "Extension Agent",
      department: "Local Government",
      location: "Wakiso District",
      phone: "+256 702 345 678",
      email: "j.mukasa@wakiso.go.ug",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      specialization: "Pest Control",
      availability: "offline",
      lastActive: "1 day ago"
    }
  ];

  const emergencyContacts = [
    {
      service: "Animal Disease Emergency",
      phone: "+256 800 100 200",
      available: "24/7"
    },
    {
      service: "Crop Pest Hotline",
      phone: "+256 800 100 300",
      available: "6 AM - 10 PM"
    },
    {
      service: "Weather Alert Service",
      phone: "+256 800 100 400",
      available: "24/7"
    }
  ];

  const getAvailabilityColor = (status) => {
    switch (status) {
      case 'online': return 'bg-success';
      case 'busy': return 'bg-warning';
      case 'offline': return 'bg-muted-foreground';
      default: return 'bg-muted-foreground';
    }
  };

  const getSpecializationIcon = (specialization) => {
    switch (specialization) {
      case 'Crop Management': return 'Wheat';
      case 'Livestock Health': return 'Heart';
      case 'Pest Control': return 'Bug';
      default: return 'User';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-organic-sm">
      <div className="p-4 sm:p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Extension Officers</h2>
        <p className="text-sm text-muted-foreground">Connect with agricultural experts</p>
      </div>
      <div className="p-4 sm:p-6">
        {/* Extension Officers */}
        <div className="space-y-4 mb-6">
          {contacts?.map((contact) => (
            <div key={contact?.id} className="border border-border rounded-lg p-3 sm:p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image 
                      src={contact?.avatar} 
                      alt={contact?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getAvailabilityColor(contact?.availability)} rounded-full border-2 border-card`}></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                    <h4 className="text-sm font-medium text-foreground">{contact?.name}</h4>
                    <div className={`w-8 h-8 bg-primary rounded-full flex items-center justify-center mt-1 sm:mt-0`}>
                      <Icon name={getSpecializationIcon(contact?.specialization)} size={14} color="white" />
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-1">{contact?.title}</p>
                  <p className="text-xs text-muted-foreground mb-2">{contact?.department} • {contact?.location}</p>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                      {contact?.specialization}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Last active: {contact?.lastActive}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="h-8 px-2"><Icon name="Phone" size={14} /></Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2"><Icon name="Mail" size={14} /></Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2"><Icon name="MessageCircle" size={14} /></Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency Contacts */}
        <div className="border-t border-border pt-6">
          <h3 className="text-sm font-medium text-foreground mb-4 flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-destructive" />
            <span>Emergency Contacts</span>
          </h3>
          
          <div className="space-y-3">
            {emergencyContacts?.map((emergency, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                <div className="mb-2 sm:mb-0">
                  <p className="text-sm font-medium text-foreground">{emergency?.service}</p>
                  <p className="text-xs text-muted-foreground">Available: {emergency?.available}</p>
                </div>
                <Button variant="destructive" size="sm">
                  <Icon name="Phone" size={14} className="mr-2" />
                  {emergency?.phone}
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <Button 
            variant="outline" 
            className="w-full"
          >
            <Icon name="UserPlus" size={16} className="mr-2" />
            Find More Experts
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExtensionContacts;