import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const VeterinarianDirectory = ({ veterinarians, onContactVet, onScheduleVisit }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  const specialties = [
    { value: 'all', label: 'All' },
    { value: 'cattle', label: 'Cattle' },
    { value: 'small_animals', label: 'Small Animals' },
    { value: 'poultry', label: 'Poultry' },
    { value: 'general', label: 'General' },
    { value: 'reproduction', label: 'Reproduction' },
    { value: 'surgery', label: 'Surgery' }
  ];

  const filteredVeterinarians = veterinarians?.filter(vet => {
    const matchesSearch = vet?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                         vet?.location?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                         vet?.specialties?.some(specialty => specialty?.toLowerCase()?.includes(searchQuery?.toLowerCase()));
    
    const matchesSpecialty = selectedSpecialty === 'all' || 
                            vet?.specialties?.some(specialty => specialty?.toLowerCase()?.includes(selectedSpecialty));
    
    return matchesSearch && matchesSpecialty;
  });

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'available': return 'text-success';
      case 'busy': return 'text-warning';
      case 'unavailable': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getAvailabilityIcon = (availability) => {
    switch (availability) {
      case 'available': return 'CheckCircle';
      case 'busy': return 'Clock';
      case 'unavailable': return 'XCircle';
      default: return 'HelpCircle';
    }
  };

  const formatDistance = (distance) => {
    return `${distance} km away`;
  };

  const formatPhoneNumber = (phone) => {
    return phone?.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-organic-sm">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div className="flex items-center space-x-3 mb-3 sm:mb-0">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="Stethoscope" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Veterinarian Directory</h2>
              <p className="text-sm text-muted-foreground">Find and contact local veterinarians</p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search by name, location, or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              className="pl-10"
            />
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>
          
          <div className="flex space-x-2 overflow-x-auto pb-2 -mx-4 sm:mx-0 px-4 sm:px-0">
            {specialties?.map(specialty => (
              <Button
                key={specialty?.value}
                variant={selectedSpecialty === specialty?.value ? 'default' : 'outline'}
                size="sm"
                className="whitespace-nowrap"
                onClick={() => setSelectedSpecialty(specialty?.value)}
              >
                {specialty?.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Veterinarian List */}
        <div className="space-y-4">
          {filteredVeterinarians?.length > 0 ? (
            filteredVeterinarians?.map((vet, index) => (
              <div key={index} className="p-3 sm:p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex flex-col sm:flex-row items-start justify-between mb-4">
                  <div className="flex items-start space-x-3 mb-3 sm:mb-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0"><Icon name="User" size={24} className="text-primary" /></div>
                    <div>
                      <h3 className="font-semibold text-foreground">{vet?.name}</h3>
                      <p className="text-sm text-muted-foreground">{vet?.qualification}</p>
                      <div className="flex items-center space-x-2 mt-1 text-sm text-muted-foreground"><Icon name="MapPin" size={14} /><span >{vet?.location}</span><span>•</span><span>{formatDistance(vet?.distance)}</span></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2"><Icon name={getAvailabilityIcon(vet?.availability)} size={16} className={getAvailabilityColor(vet?.availability)} /><span className={`text-sm font-medium ${getAvailabilityColor(vet?.availability)}`}>{vet?.availability?.charAt(0)?.toUpperCase() + vet?.availability?.slice(1)}</span></div>
                </div>

                <div className="mb-4"><div className="flex flex-wrap gap-2">{vet?.specialties?.map((specialty, idx) => <span key={idx} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">{specialty}</span>)}</div></div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center space-x-2"><Icon name="Phone" size={16} className="text-muted-foreground" /><span className="text-foreground">{formatPhoneNumber(vet?.phone)}</span></div>
                  <div className="flex items-center space-x-2"><Icon name="Mail" size={16} className="text-muted-foreground" /><span className="text-foreground truncate">{vet?.email}</span></div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4 text-sm p-3 bg-muted/30 rounded-lg">
                  <div><p className="text-muted-foreground text-xs">Experience</p><p className="font-medium text-foreground">{vet?.experience} years</p></div>
                  <div><p className="text-muted-foreground text-xs">Rating</p><div className="flex items-center space-x-1"><div className="flex space-x-0.5">{[...Array(5)]?.map((_, i) => <Icon key={i} name="Star" size={14} className={i < Math.floor(vet?.rating) ? 'text-warning fill-current' : 'text-muted-foreground'} />)}</div><span className="font-medium text-foreground">({vet?.rating})</span></div></div>
                  <div><p className="text-muted-foreground text-xs">Fee</p><p className="font-medium text-foreground">{new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX', minimumFractionDigits: 0 })?.format(vet?.consultationFee)}</p></div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button size="sm" onClick={() => onContactVet(vet)} disabled={vet?.availability === 'unavailable'} className="flex-1"><Icon name="Phone" size={14} className="mr-2" />Call Now</Button>
                  <Button variant="outline" size="sm" onClick={() => onScheduleVisit(vet)} disabled={vet?.availability === 'unavailable'} className="flex-1"><Icon name="Calendar" size={14} className="mr-2" />Schedule</Button>
                  <Button variant="ghost" size="sm" className="flex-1"><Icon name="MessageCircle" size={14} className="mr-2" />Message</Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No veterinarians found matching your criteria</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => { setSearchQuery(''); setSelectedSpecialty('all'); }}>Clear Filters</Button>
            </div>
          )}
        </div>

        {/* Emergency Contact */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <div className="flex items-center space-x-3 mb-3 sm:mb-0 sm:mr-4"><Icon name="AlertTriangle" size={20} className="text-destructive flex-shrink-0" /><div><h3 className="font-medium text-destructive">Emergency Veterinary Services</h3><p className="text-sm text-destructive/80">For urgent animal health emergencies</p></div></div>
              <Button variant="destructive" size="sm" className="w-full sm:w-auto sm:ml-auto"><Icon name="Phone" size={14} className="mr-2" />Call Emergency</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VeterinarianDirectory;