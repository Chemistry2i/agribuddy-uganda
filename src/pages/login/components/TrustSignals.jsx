import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const endorsements = [
    {
      id: 1,
      name: "Ministry of Agriculture",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=120&h=60&fit=crop",
      description: "Official Partner"
    },
    {
      id: 2,
      name: "Uganda Coffee Development Authority",
      logo: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=120&h=60&fit=crop",
      description: "Certified Platform"
    },
    {
      id: 3,
      name: "National Agricultural Research Organisation",
      logo: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=120&h=60&fit=crop",
      description: "Research Partner"
    }
  ];

  const stats = [
    { icon: 'Users', value: '50,000+', label: 'Active Farmers' },
    { icon: 'MapPin', value: '112', label: 'Districts Covered' },
    { icon: 'TrendingUp', value: '35%', label: 'Yield Improvement' }
  ];

  return (
    <div className="space-y-8">
      {/* Partnership Logos */}
      <div className="text-center">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">
          Trusted by Leading Agricultural Organizations
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {endorsements?.map((partner) => (
            <div
              key={partner?.id}
              className="flex flex-col items-center p-4 bg-card border border-border rounded-lg hover:shadow-organic-sm transition-shadow"
            >
              <div className="w-16 h-12 mb-2 overflow-hidden rounded">
                <Image
                  src={partner?.logo}
                  alt={partner?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs font-medium text-foreground text-center leading-tight">
                {partner?.name}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {partner?.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Impact Statistics */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h3 className="text-sm font-medium text-foreground mb-4 text-center">
          Empowering Ugandan Agriculture
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {stats?.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Icon name={stat?.icon} size={20} className="text-primary" />
              </div>
              <p className="text-lg font-semibold text-foreground">{stat?.value}</p>
              <p className="text-xs text-muted-foreground leading-tight">{stat?.label}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Security Badge */}
      <div className="flex items-center justify-center space-x-2 text-muted-foreground">
        <Icon name="Shield" size={16} className="text-success" />
        <span className="text-xs">Secure & Privacy Protected</span>
        <Icon name="Lock" size={16} className="text-success" />
      </div>
    </div>
  );
};

export default TrustSignals;