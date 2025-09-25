import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const FilterToolbar = ({ 
  filters, 
  onFilterChange, 
  onSearch, 
  searchQuery, 
  onAddAnimal,
  totalAnimals,
  filteredCount 
}) => {
  const animalTypeOptions = [
    { value: 'all', label: 'All Animals' },
    { value: 'cattle', label: 'Cattle' },
    { value: 'goat', label: 'Goats' },
    { value: 'pig', label: 'Pigs' },
    { value: 'chicken', label: 'Chickens' }
  ];

  const healthStatusOptions = [
    { value: 'all', label: 'All Health' },
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ];

  const careNeedsOptions = [
    { value: 'all', label: 'All Care Needs' },
    { value: 'vaccination_due', label: 'Vaccination Due' },
    { value: 'health_check', label: 'Health Check Due' },
    { value: 'breeding_ready', label: 'Breeding Ready' },
    { value: 'treatment_needed', label: 'Treatment Needed' }
  ];

  const sortOptions = [
    { value: 'name_asc', label: 'Name (A-Z)' },
    { value: 'name_desc', label: 'Name (Z-A)' },
    { value: 'health_status', label: 'Health Status' },
    { value: 'age_asc', label: 'Age (Youngest)' },
    { value: 'age_desc', label: 'Age (Oldest)' },
    { value: 'value_desc', label: 'Value (Highest)' },
    { value: 'last_check', label: 'Last Health Check' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg shadow-organic-sm mb-6">
      <div className="p-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
          <div className="flex items-center space-x-3 mb-3 sm:mb-0">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="Filter" size={16} className="text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Filter & Search</h3>
              <p className="text-sm text-muted-foreground">
                Showing {filteredCount} of {totalAnimals} animals
              </p>
            </div>
          </div>
          <Button
            onClick={onAddAnimal}
            size="sm"
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Add Animal
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search by name, tag ID, or type..."
              value={searchQuery}
              onChange={(e) => onSearch(e?.target?.value)}
              className="pl-10"
            />
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            label="Animal Type"
            options={animalTypeOptions}
            value={filters?.animalType}
            onChange={(value) => onFilterChange('animalType', value)}
            className="w-full"
          />
          
          <Select
            label="Health Status"
            options={healthStatusOptions}
            value={filters?.healthStatus}
            onChange={(value) => onFilterChange('healthStatus', value)}
            className="w-full"
          />
          
          <Select
            label="Care Needs"
            options={careNeedsOptions}
            value={filters?.careNeeds}
            onChange={(value) => onFilterChange('careNeeds', value)}
            className="w-full"
          />
          
          <Select
            label="Sort By"
            options={sortOptions}
            value={filters?.sortBy}
            onChange={(value) => onFilterChange('sortBy', value)}
            className="w-full"
          />
        </div>

        {/* Active Filters */}
        {(filters?.animalType !== 'all' || filters?.healthStatus !== 'all' || filters?.careNeeds !== 'all' || searchQuery) && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              
              {filters?.animalType !== 'all' && (
                <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                  <span>{animalTypeOptions?.find(opt => opt?.value === filters?.animalType)?.label}</span>
                  <button onClick={() => onFilterChange('animalType', 'all')} className="hover:bg-primary/20 rounded-full p-0.5"><Icon name="X" size={12} /></button>
                </div>
              )}
              
              {filters?.healthStatus !== 'all' && (
                <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                  <span>{healthStatusOptions?.find(opt => opt?.value === filters?.healthStatus)?.label}</span>
                  <button onClick={() => onFilterChange('healthStatus', 'all')} className="hover:bg-primary/20 rounded-full p-0.5"><Icon name="X" size={12} /></button>
                </div>
              )}
              
              {filters?.careNeeds !== 'all' && (
                <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                  <span>{careNeedsOptions?.find(opt => opt?.value === filters?.careNeeds)?.label}</span>
                  <button onClick={() => onFilterChange('careNeeds', 'all')} className="hover:bg-primary/20 rounded-full p-0.5"><Icon name="X" size={12} /></button>
                </div>
              )}
              
              {searchQuery && (
                <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                  <span>Search: "{searchQuery}"</span>
                  <button onClick={() => onSearch('')} className="hover:bg-primary/20 rounded-full p-0.5"><Icon name="X" size={12} /></button>
                </div>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-auto py-1 px-2"
                onClick={() => {
                  onFilterChange('animalType', 'all');
                  onFilterChange('healthStatus', 'all');
                  onFilterChange('careNeeds', 'all');
                  onSearch('');
                }}
              >
                Clear all
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterToolbar;