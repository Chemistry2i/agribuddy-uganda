import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const AnimalCard = ({ animal, onHealthAssessment, onUpdateRecord, onViewDetails }) => {
  const [imageError, setImageError] = useState(false);

  const getHealthStatusColor = (status) => {
    switch (status) {
      case 'excellent':
        return 'bg-success text-success-foreground';
      case 'good':
        return 'bg-primary text-primary-foreground';
      case 'fair':
        return 'bg-warning text-warning-foreground';
      case 'poor':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getAnimalIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'cattle':
        return 'Cow';
      case 'goat':
        return 'Rabbit';
      case 'pig':
        return 'PiggyBank';
      case 'chicken':
        return 'Bird';
      default:
        return 'Heart';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    })?.format(amount);
  };

  const getDaysUntilVaccination = (date) => {
    const today = new Date();
    const vaccinationDate = new Date(date);
    const diffTime = vaccinationDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const vaccinationDays = getDaysUntilVaccination(animal?.nextVaccination);

  return (
    <div className="bg-card border border-border rounded-lg shadow-organic-sm hover:shadow-organic-md transition-all duration-200 grow-on-hover flex flex-col">
      <div className="p-4 flex-grow">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name={getAnimalIcon(animal?.type)} size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-base sm:text-lg">{animal?.name}</h3>
              <p className="text-sm text-muted-foreground">ID: {animal?.tagId}</p>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthStatusColor(animal?.healthStatus)}`}>
            {animal?.healthStatus?.charAt(0)?.toUpperCase() + animal?.healthStatus?.slice(1)}
          </div>
        </div>

        {/* Animal Photo */}
        <div className="relative mb-4">
          <div className="w-full h-40 sm:h-48 bg-muted rounded-lg overflow-hidden">
            {!imageError ? (
              <Image
                src={animal?.photo}
                alt={`${animal?.name} - ${animal?.type}`}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <Icon name={getAnimalIcon(animal?.type)} size={48} className="text-muted-foreground" />
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-card/80 backdrop-blur-sm hover:bg-card h-8 w-8"
            onClick={() => {/* Handle photo update */}}
          >
            <Icon name="Camera" size={16} />
          </Button>
        </div>

        {/* Animal Details */}
        <div className="space-y-2 text-sm mb-4">
          <div className="flex items-center justify-between"><span className="text-muted-foreground">Type:</span><span className="font-medium text-foreground">{animal?.type}</span></div>
          <div className="flex items-center justify-between"><span className="text-muted-foreground">Age:</span><span className="font-medium text-foreground">{animal?.age}</span></div>
          <div className="flex items-center justify-between"><span className="text-muted-foreground">Weight:</span><span className="font-medium text-foreground">{animal?.weight} kg</span></div>
          <div className="flex items-center justify-between"><span className="text-muted-foreground">Value:</span><span className="font-medium text-foreground">{formatCurrency(animal?.estimatedValue)}</span></div>
        </div>

        <div className="flex-grow"></div>

        {/* Vaccination Alert */}
        {vaccinationDays <= 7 && vaccinationDays >= 0 && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-2 sm:p-3 mb-4">
            <div className="flex items-center space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-warning" />
              <span className="text-sm font-medium text-warning">
                Vaccination due in {vaccinationDays} day{vaccinationDays !== 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-xs text-warning/80 mt-1">
              Next: {new Date(animal.nextVaccination)?.toLocaleDateString('en-GB')}
            </p>
          </div>
        )}

        {/* Breeding Status */}
        {animal?.breedingStatus && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-2 sm:p-3 mb-4">
            <div className="flex items-center space-x-2">
              <Icon name="Heart" size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">
                {animal?.breedingStatus}
              </span>
            </div>
            {animal?.expectedDelivery && (
              <p className="text-xs text-primary/80 mt-1">
                Expected: {new Date(animal.expectedDelivery)?.toLocaleDateString('en-GB')}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-auto">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onHealthAssessment(animal)}
          >
            <Icon name="Stethoscope" size={14} className="mr-2" />
            Health Check
          </Button>
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            onClick={() => onUpdateRecord(animal)}
          >
            <Icon name="Edit" size={14} className="mr-2" />
            Update
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 mt-4 p-4 border-t border-border bg-muted/30 rounded-b-lg">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Last Check</p>
          <p className="text-sm font-medium text-foreground">
            {new Date(animal.lastHealthCheck)?.toLocaleDateString('en-GB', {day: '2-digit', month: 'short'})}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Treatments</p>
          <p className="text-sm font-medium text-foreground">{animal?.treatmentCount}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Offspring</p>
          <p className="text-sm font-medium text-foreground">{animal?.offspringCount}</p>
        </div>
      </div>
    </div>
  );
};

export default AnimalCard;