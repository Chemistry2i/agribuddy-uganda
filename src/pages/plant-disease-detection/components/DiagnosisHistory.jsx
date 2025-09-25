import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const DiagnosisHistory = ({ onSelectDiagnosis }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const mockHistory = [
    { id: 1, date: new Date('2025-01-15'), cropType: 'Coffee', disease: 'Coffee Leaf Rust', confidence: 92, status: 'treated', image: 'https://images.pexels.com/photos/4022092/pexels-photo-4022092.jpeg', treatmentApplied: 'Copper-based fungicide', notes: 'Treatment applied successfully. Monitoring progress.' },
    { id: 2, date: new Date('2025-01-12'), cropType: 'Matooke', disease: 'Black Sigatoka', confidence: 87, status: 'in-progress', image: 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg', treatmentApplied: 'Organic neem oil spray', notes: 'First treatment completed. Second application scheduled.' },
    { id: 3, date: new Date('2025-01-10'), cropType: 'Maize', disease: 'Maize Streak Virus', confidence: 78, status: 'pending', image: 'https://images.pexels.com/photos/2589457/pexels-photo-2589457.jpeg', treatmentApplied: null, notes: 'Awaiting treatment supplies.' },
    { id: 4, date: new Date('2025-01-08'), cropType: 'Coffee', disease: 'Coffee Berry Disease', confidence: 94, status: 'treated', image: 'https://images.pexels.com/photos/4022092/pexels-photo-4022092.jpeg', treatmentApplied: 'Copper hydroxide spray', notes: 'Treatment successful.' },
    { id: 5, date: new Date('2025-01-05'), cropType: 'Beans', disease: 'Bean Rust', confidence: 85, status: 'treated', image: 'https://images.pexels.com/photos/1459339/pexels-photo-1459339.jpeg', treatmentApplied: 'Systemic fungicide', notes: 'Complete recovery.' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All', icon: 'List' },
    { value: 'pending', label: 'Pending', icon: 'Clock' },
    { value: 'in-progress', label: 'In Progress', icon: 'Activity' },
    { value: 'treated', label: 'Treated', icon: 'CheckCircle' }
  ];

  const filteredHistory = selectedFilter === 'all' 
    ? mockHistory 
    : mockHistory?.filter(item => item?.status === selectedFilter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'treated': return 'bg-success/10 text-success';
      case 'in-progress': return 'bg-warning/10 text-warning';
      case 'pending': return 'bg-error/10 text-error';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'treated': return 'Treated';
      case 'in-progress': return 'In Progress';
      case 'pending': return 'Pending';
      default: return 'Unknown';
    }
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-organic-md">
      <div className="p-4 sm:p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="flex items-center space-x-3 mb-3 sm:mb-0">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0"><Icon name="History" size={20} className="text-accent" /></div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Diagnosis History</h2>
              <p className="text-sm text-muted-foreground">Previous detections and treatments</p>
            </div>
          </div>
          <Button variant="outline" size="sm"><Icon name="Download" size={14} className="mr-2"/>Export</Button>
        </div>
      </div>
      
      <div className="p-4 sm:p-6 border-b border-border">
        <div className="flex flex-wrap gap-2">
          {filterOptions?.map((option) => (
            <Button key={option?.value} variant={selectedFilter === option?.value ? "default" : "ghost"} size="sm" onClick={() => setSelectedFilter(option?.value)} className="flex-shrink-0"><Icon name={option?.icon} size={14} className="mr-2"/>{option?.label}</Button>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {filteredHistory?.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4"><Icon name="Search" size={32} className="text-muted-foreground" /></div>
            <h3 className="text-lg font-medium text-foreground mb-2">No Results Found</h3>
            <p className="text-sm text-muted-foreground">No diagnoses match the filter criteria.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHistory?.map((diagnosis) => (
              <div key={diagnosis?.id} className="border border-border rounded-lg p-3 sm:p-4 hover:bg-muted/30 transition-colors cursor-pointer grow-on-hover" onClick={() => onSelectDiagnosis && onSelectDiagnosis(diagnosis)}>
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0"><Image src={diagnosis?.image} alt={`${diagnosis?.cropType} diagnosis`} className="w-full h-full object-cover" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-foreground truncate text-sm sm:text-base">{diagnosis?.disease}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">{diagnosis?.cropType} • {formatDate(diagnosis?.date)}</p>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0 mt-1 sm:mt-0">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(diagnosis?.status)}`}>{getStatusText(diagnosis?.status)}</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{diagnosis?.confidence}%</span>
                      </div>
                    </div>
                    {diagnosis?.treatmentApplied && <p className="text-sm text-muted-foreground mb-2"><span className="font-medium">Treatment:</span> {diagnosis?.treatmentApplied}</p>}
                    {diagnosis?.notes && <p className="text-sm text-muted-foreground line-clamp-1 sm:line-clamp-2">{diagnosis?.notes}</p>}
                    <div className="flex items-center space-x-2 mt-2">
                      <Button variant="ghost" size="xs" onClick={(e) => { e.stopPropagation(); onSelectDiagnosis && onSelectDiagnosis(diagnosis); }}><Icon name="Eye" size={14} className="mr-1"/>Details</Button>
                      {diagnosis?.status === 'pending' && <Button variant="ghost" size="xs" onClick={(e) => e.stopPropagation()}><Icon name="Play" size={14} className="mr-1"/>Start</Button>}
                      {diagnosis?.status === 'in-progress' && <Button variant="ghost" size="xs" onClick={(e) => e.stopPropagation()}><Icon name="Edit" size={14} className="mr-1"/>Update</Button>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 sm:p-6 border-t border-border bg-muted/20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center"><div className="text-2xl font-bold text-foreground">{mockHistory?.length}</div><div className="text-sm text-muted-foreground">Total</div></div>
          <div className="text-center"><div className="text-2xl font-bold text-success">{mockHistory?.filter(d => d?.status === 'treated')?.length}</div><div className="text-sm text-muted-foreground">Treated</div></div>
          <div className="text-center"><div className="text-2xl font-bold text-warning">{mockHistory?.filter(d => d?.status === 'in-progress')?.length}</div><div className="text-sm text-muted-foreground">In Progress</div></div>
          <div className="text-center"><div className="text-2xl font-bold text-error">{mockHistory?.filter(d => d?.status === 'pending')?.length}</div><div className="text-sm text-muted-foreground">Pending</div></div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisHistory;