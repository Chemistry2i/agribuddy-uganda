import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import AnimalCard from './components/AnimalCard';
import HerdStatistics from './components/HerdStatistics';
import VaccinationCalendar from './components/VaccinationCalendar';
import FilterToolbar from './components/FilterToolbar';
import BreedingCalendar from './components/BreedingCalendar';
import VeterinarianDirectory from './components/VeterinarianDirectory';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const LivestockManagement = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    animalType: 'all',
    healthStatus: 'all',
    careNeeds: 'all',
    sortBy: 'name_asc'
  });

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      const largeScreen = window.innerWidth >= 1024;
      setIsMobile(mobile);
      setSidebarExpanded(largeScreen);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Mock data for livestock
  const mockAnimals = [
    {
      id: 1,
      name: "Bella",
      tagId: "COW001",
      type: "Cattle",
      age: "3 years",
      weight: 450,
      healthStatus: "excellent",
      photo: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      estimatedValue: 2500000,
      nextVaccination: "2025-01-25",
      lastHealthCheck: "2025-01-10",
      treatmentCount: 2,
      offspringCount: 1,
      breedingStatus: "Pregnant",
      expectedDelivery: "2025-03-15"
    },
    {
      id: 2,
      name: "Thunder",
      tagId: "BULL001",
      type: "Cattle",
      age: "5 years",
      weight: 650,
      healthStatus: "good",
      photo: "https://images.unsplash.com/photo-1502590464431-3b66d77494d7?q=80&w=2148&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      estimatedValue: 3200000,
      nextVaccination: "2025-02-10",
      lastHealthCheck: "2025-01-08",
      treatmentCount: 1,
      offspringCount: 8,
      breedingStatus: null
    },
    {
      id: 3,
      name: "Daisy",
      tagId: "GOAT001",
      type: "Goat",
      age: "2 years",
      weight: 35,
      healthStatus: "fair",
      photo: "https://images.unsplash.com/photo-1442943861491-36a87a01e726?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      estimatedValue: 450000,
      nextVaccination: "2025-01-20",
      lastHealthCheck: "2025-01-12",
      treatmentCount: 3,
      offspringCount: 2,
      breedingStatus: "Ready for breeding"
    },
    {
      id: 4,
      name: "Porky",
      tagId: "PIG001",
      type: "Pig",
      age: "1.5 years",
      weight: 85,
      healthStatus: "good",
      photo: "https://images.unsplash.com/photo-1557948457-18aa5ac00cec?q=80&w=2148&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      estimatedValue: 650000,
      nextVaccination: "2025-02-05",
      lastHealthCheck: "2025-01-14",
      treatmentCount: 1,
      offspringCount: 0,
      breedingStatus: null
    },
    {
      id: 5,
      name: "Henrietta",
      tagId: "CHICK001",
      type: "Chicken",
      age: "8 months",
      weight: 2.5,
      healthStatus: "excellent",
      photo: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&h=300&fit=crop",
      estimatedValue: 25000,
      nextVaccination: "2025-01-30",
      lastHealthCheck: "2025-01-15",
      treatmentCount: 0,
      offspringCount: 0,
      breedingStatus: "Laying eggs"
    },
    {
      id: 6,
      name: "Moobert",
      tagId: "COW002",
      type: "Cattle",
      age: "4 years",
      weight: 520,
      healthStatus: "poor",
      photo: "https://images.unsplash.com/photo-1607771459220-36163d88974c?q=80&w=1288&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      estimatedValue: 2200000,
      nextVaccination: "2025-01-18",
      lastHealthCheck: "2025-01-16",
      treatmentCount: 5,
      offspringCount: 2,
      breedingStatus: null
    }
  ];

  // Mock statistics
  const mockStatistics = {
    totalAnimals: 6,
    totalValue: 9075000,
    animalTypes: {
      cattle: 3,
      goat: 1,
      pig: 1,
      chicken: 1
    },
    healthBreakdown: {
      excellent: 2,
      good: 2,
      fair: 1,
      poor: 1
    },
    monthlyExpenses: {
      medication: 150000,
      feed: 450000,
      veterinary: 200000
    }
  };

  // Mock vaccination data
  const mockVaccinations = [
    {
      id: 1,
      animalName: "Bella",
      tagId: "COW001",
      vaccineType: "FMD Vaccine",
      scheduledDate: "2025-01-25",
      status: "scheduled"
    },
    {
      id: 2,
      animalName: "Henrietta",
      tagId: "CHICK001",
      vaccineType: "Newcastle Disease",
      scheduledDate: "2025-01-30",
      status: "scheduled"
    },
    {
      id: 3,
      animalName: "Moobert",
      tagId: "COW002",
      vaccineType: "Anthrax Vaccine",
      scheduledDate: "2025-01-18",
      status: "overdue"
    },
    {
      id: 4,
      animalName: "Thunder",
      tagId: "BULL001",
      vaccineType: "Brucellosis",
      scheduledDate: "2025-02-10",
      status: "scheduled"
    }
  ];

  // Mock breeding records
  const mockBreedingRecords = [
    {
      id: 1,
      animalName: "Bella",
      tagId: "COW001",
      age: "3 years",
      status: "pregnant",
      expectedDelivery: "2025-03-15",
      breedingPartner: "Thunder",
      lastBreeding: "2024-06-15",
      offspringCount: 1,
      successRate: 100
    },
    {
      id: 2,
      animalName: "Daisy",
      tagId: "GOAT001",
      age: "2 years",
      status: "ready",
      lastBreeding: "2024-08-20",
      offspringCount: 2,
      successRate: 85
    },
    {
      id: 3,
      animalName: "Thunder",
      tagId: "BULL001",
      age: "5 years",
      status: "breeding",
      lastBreeding: "2024-06-15",
      offspringCount: 8,
      successRate: 95
    }
  ];

  // Mock veterinarian data
  const mockVeterinarians = [
    {
      id: 1,
      name: "Dr. Sarah Nakamya",
      qualification: "DVM, MSc Animal Health",
      location: "Kampala Central",
      distance: 5.2,
      phone: "256701234567",
      email: "sarah.nakamya@vetclinic.ug",
      specialties: ["Cattle Specialist", "Reproduction", "General Practice"],
      experience: 12,
      rating: 4.8,
      availability: "available",
      consultationFee: 150000,
      workingHours: "Mon-Fri: 8AM-6PM, Sat: 8AM-2PM",
      services: ["Vaccination", "Surgery", "Emergency Care", "Breeding Consultation"]
    },
    {
      id: 2,
      name: "Dr. James Okello",
      qualification: "DVM, PhD Veterinary Medicine",
      location: "Entebbe",
      distance: 12.8,
      phone: "256702345678",
      email: "james.okello@animalcare.ug",
      specialties: ["Small Animals", "Poultry", "Surgery"],
      experience: 8,
      rating: 4.6,
      availability: "busy",
      consultationFee: 120000,
      workingHours: "Mon-Sat: 7AM-7PM",
      services: ["Health Checkups", "Vaccination", "Disease Treatment"]
    },
    {
      id: 3,
      name: "Dr. Mary Atuhaire",
      qualification: "DVM, Cert. Animal Nutrition",
      location: "Mukono",
      distance: 18.5,
      phone: "256703456789",
      email: "mary.atuhaire@livestock.ug",
      specialties: ["Cattle Specialist", "Nutrition", "Reproduction"],
      experience: 15,
      rating: 4.9,
      availability: "available",
      consultationFee: 180000,
      workingHours: "Mon-Fri: 9AM-5PM",
      services: ["Breeding Programs", "Nutrition Consultation", "Herd Health Management"]
    }
  ];

  // Filter animals based on search and filters
  const filteredAnimals = mockAnimals?.filter(animal => {
    const matchesSearch = animal?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                         animal?.tagId?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                         animal?.type?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    
    const matchesType = filters?.animalType === 'all' || 
                       animal?.type?.toLowerCase() === filters?.animalType;
    
    const matchesHealth = filters?.healthStatus === 'all' || 
                         animal?.healthStatus === filters?.healthStatus;
    
    const matchesCareNeeds = filters?.careNeeds === 'all' || 
                            (filters?.careNeeds === 'vaccination_due' && 
                             new Date(animal.nextVaccination) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    
    return matchesSearch && matchesType && matchesHealth && matchesCareNeeds;
  });

  // Sort filtered animals
  const sortedAnimals = [...filteredAnimals]?.sort((a, b) => {
    switch (filters?.sortBy) {
      case 'name_asc':
        return a?.name?.localeCompare(b?.name);
      case 'name_desc':
        return b?.name?.localeCompare(a?.name);
      case 'health_status':
        const healthOrder = { excellent: 4, good: 3, fair: 2, poor: 1 };
        return healthOrder?.[b?.healthStatus] - healthOrder?.[a?.healthStatus];
      case 'age_asc':
        return parseInt(a?.age) - parseInt(b?.age);
      case 'age_desc':
        return parseInt(b?.age) - parseInt(a?.age);
      case 'value_desc':
        return b?.estimatedValue - a?.estimatedValue;
      case 'last_check':
        return new Date(b.lastHealthCheck) - new Date(a.lastHealthCheck);
      default:
        return 0;
    }
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleHealthAssessment = (animal) => {
    console.log('Health assessment for:', animal?.name);
    // Handle health assessment logic
  };

  const handleUpdateRecord = (animal) => {
    console.log('Update record for:', animal?.name);
    // Handle record update logic
  };

  const handleScheduleVaccination = () => {
    console.log('Schedule vaccination');
    // Handle vaccination scheduling
  };

  const handleMarkVaccinationComplete = (vaccination) => {
    console.log('Mark vaccination complete:', vaccination);
    // Handle vaccination completion
  };

  const handleScheduleBreeding = (animal) => {
    console.log('Schedule breeding for:', animal?.name || 'new animal');
    // Handle breeding scheduling
  };

  const handleContactVet = (vet) => {
    console.log('Contact veterinarian:', vet?.name);
    // Handle veterinarian contact
  };

  const handleScheduleVetVisit = (vet) => {
    console.log('Schedule visit with:', vet?.name);
    // Handle veterinarian visit scheduling
  };

  const handleAddAnimal = () => {
    console.log('Add new animal');
    // Handle adding new animal
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'animals', label: 'Animals', icon: 'Cow' },
    { id: 'vaccinations', label: 'Vaccinations', icon: 'Syringe' },
    { id: 'breeding', label: 'Breeding', icon: 'Heart' },
    { id: 'veterinarians', label: 'Vets', icon: 'Stethoscope' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onToggleSidebar={() => setSidebarExpanded(!sidebarExpanded)}
        sidebarExpanded={sidebarExpanded}
        userRole="farmer"
      />
      <Sidebar 
        isExpanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
        userRole="farmer"
        weatherAlerts={2}
      />
      <main className={`pt-16 pb-20 lg:pb-6 transition-all duration-300 ${
        isMobile ? 'ml-0' : sidebarExpanded ? 'lg:ml-80' : 'lg:ml-16'
      }`}>
        <div className="p-4 sm:p-6 max-w-8xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mb-3 sm:mb-0">
                <Icon name="Cow" size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Livestock Management</h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Animal health tracking and breeding management
                </p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="-mb-1">
              <div className="flex space-x-1 bg-muted p-1 rounded-lg overflow-x-auto">
                {tabs?.map(tab => (
                  <Button
                    key={tab?.id}
                    variant={activeTab === tab?.id ? 'default' : 'ghost'}
                    size="sm"
                    className="flex items-center space-x-2 whitespace-nowrap flex-1 justify-center"
                    onClick={() => setActiveTab(tab?.id)}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span className="hidden sm:inline">{tab?.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <HerdStatistics statistics={mockStatistics} />
              </div>
              <div className="lg:col-span-1 space-y-6">
                <VaccinationCalendar 
                  vaccinations={mockVaccinations}
                  onScheduleVaccination={handleScheduleVaccination}
                  onMarkComplete={handleMarkVaccinationComplete}
                />
                <BreedingCalendar 
                  breedingRecords={mockBreedingRecords}
                  onScheduleBreeding={handleScheduleBreeding}
                  onUpdateRecord={handleUpdateRecord}
                />
              </div>
            </div>
          )}

          {/* Animals Tab */}
          {activeTab === 'animals' && (
            <div className="space-y-6">
              <FilterToolbar
                filters={filters}
                onFilterChange={handleFilterChange}
                onSearch={setSearchQuery}
                searchQuery={searchQuery}
                onAddAnimal={handleAddAnimal}
                totalAnimals={mockAnimals?.length}
                filteredCount={sortedAnimals?.length}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {sortedAnimals?.map(animal => (
                  <AnimalCard
                    key={animal?.id}
                    animal={animal}
                    onHealthAssessment={handleHealthAssessment}
                    onUpdateRecord={handleUpdateRecord}
                    onViewDetails={() => console.log('View details:', animal?.name)}
                  />
                ))}
              </div>

              {sortedAnimals?.length === 0 && (
                <div className="text-center py-12">
                  <Icon name="Search" size={64} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No animals found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search criteria or add a new animal to get started.
                  </p>
                  <Button
                    variant="default"
                    onClick={handleAddAnimal}
                  >
                    <Icon name="Plus" size={16} className="mr-2" />
                    Add Your First Animal
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Vaccinations Tab */}
          {activeTab === 'vaccinations' && (
            <div className="max-w-4xl mx-auto">
              <VaccinationCalendar 
                vaccinations={mockVaccinations}
                onScheduleVaccination={handleScheduleVaccination}
                onMarkComplete={handleMarkVaccinationComplete}
              />
            </div>
          )}

          {/* Breeding Tab */}
          {activeTab === 'breeding' && (
            <div className="max-w-4xl mx-auto">
              <BreedingCalendar 
                breedingRecords={mockBreedingRecords}
                onScheduleBreeding={handleScheduleBreeding}
                onUpdateRecord={handleUpdateRecord}
              />
            </div>
          )}

          {/* Veterinarians Tab */}
          {activeTab === 'veterinarians' && (
            <div className="max-w-4xl mx-auto">
              <VeterinarianDirectory 
                veterinarians={mockVeterinarians}
                onContactVet={handleContactVet}
                onScheduleVisit={handleScheduleVetVisit}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LivestockManagement;