import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const AnalysisResults = ({ results, isAnalyzing, capturedImage }) => {
  const [expandedTreatment, setExpandedTreatment] = useState(null);

  if (isAnalyzing) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-organic-md">
        <div className="p-6">
          <div className="text-center space-y-4 py-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">AI Analysis in Progress</h3>
              <p className="text-sm text-muted-foreground">Our AI is examining your plant image...</p>
            </div>
            <div className="w-full bg-muted rounded-full h-2"><div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div></div>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-organic-md h-full flex flex-col">
        <div className="p-6 flex-grow flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto"><Icon name="Scan" size={32} className="text-muted-foreground" /></div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Ready for Analysis</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">Capture or upload a plant image to get started with AI-powered disease detection.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-success bg-success/10';
    if (confidence >= 60) return 'text-warning bg-warning/10';
    return 'text-error bg-error/10';
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl border border-border shadow-organic-md">
        <div className="p-4 sm:p-6 border-b border-border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="flex items-center space-x-3 mb-3 sm:mb-0">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0"><Icon name="CheckCircle" size={20} className="text-success" /></div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Analysis Complete</h2>
                <p className="text-sm text-muted-foreground">AI disease identification results</p>
              </div>
            </div>
            <Button variant="outline" size="sm"><Icon name="Download" size={14} className="mr-2"/>Save Report</Button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Analyzed Image</h3>
              <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden border border-border"><Image src={capturedImage} alt="Analyzed plant" className="w-full h-full object-cover" /></div>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Disease Detection</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span>Disease:</span><span className="font-semibold text-error">{results?.disease}</span></div>
                <div className="flex justify-between"><span>Crop Type:</span><span className="text-muted-foreground">{results?.cropType}</span></div>
                <div className="flex justify-between items-center"><span>Confidence:</span><span className={`font-medium px-2 py-1 rounded-full text-xs ${getConfidenceColor(results?.confidence)}`}>{results?.confidence}%</span></div>
              </div>
              <div className="space-y-2">
                <div className="w-full bg-muted rounded-full h-3"><div className={`h-3 rounded-full transition-all duration-1000 ${results?.confidence >= 80 ? 'bg-success' : results?.confidence >= 60 ? 'bg-warning' : 'bg-error'}`} style={{ width: `${results?.confidence}%` }}></div></div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 sm:p-4"><h4 className="font-medium text-foreground mb-2 text-sm">Disease Information</h4><p className="text-sm text-muted-foreground leading-relaxed">{results?.description}</p></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-xl border border-border shadow-organic-md">
        <div className="p-4 sm:p-6 border-b border-border">
          <div className="flex items-center space-x-3"><div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0"><Icon name="Stethoscope" size={20} className="text-primary" /></div><div><h2 className="text-lg font-semibold text-foreground">Treatment Recommendations</h2><p className="text-sm text-muted-foreground">Tailored solutions for Ugandan farming</p></div></div>
        </div>
        <div className="p-4 sm:p-6 space-y-4">
          {results?.treatments?.map((treatment, index) => (
            <div key={index} className="border border-border rounded-lg overflow-hidden">
              <button className="w-full p-3 sm:p-4 text-left hover:bg-muted/50 transition-colors" onClick={() => setExpandedTreatment(expandedTreatment === index ? null : index)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3"><div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${treatment?.type === 'organic' ? 'bg-success/10' : 'bg-warning/10'}`}><Icon name={treatment?.type === 'organic' ? 'Leaf' : 'Flask'} size={16} className={treatment?.type === 'organic' ? 'text-success' : 'text-warning'} /></div><div><h3 className="font-medium text-foreground text-sm">{treatment?.name}</h3><p className="text-xs text-muted-foreground">{treatment?.type === 'organic' ? 'Organic' : 'Chemical'}</p></div></div>
                  <div className="flex items-center space-x-2"><span className={`text-xs px-2 py-1 rounded-full ${treatment?.availability === 'Available' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>{treatment?.availability}</span><Icon name={expandedTreatment === index ? 'ChevronUp' : 'ChevronDown'} size={16} className="text-muted-foreground" /></div>
                </div>
              </button>
              {expandedTreatment === index && (
                <div className="border-t border-border p-3 sm:p-4 bg-muted/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3"><h4 className="font-medium text-foreground text-sm mb-1">Instructions</h4><p className="text-sm text-muted-foreground leading-relaxed">{treatment?.instructions}</p></div>
                    <div className="space-y-3"><h4 className="font-medium text-foreground text-sm mb-1">Dosage</h4><p className="text-sm text-muted-foreground">{treatment?.dosage}</p><h4 className="font-medium text-foreground text-sm mb-1 mt-2">Timing</h4><p className="text-sm text-muted-foreground">{treatment?.timing}</p><h4 className="font-medium text-foreground text-sm mb-1 mt-2">Cost</h4><p className="text-sm font-medium text-foreground">{treatment?.cost}</p></div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border"><div className="flex flex-wrap gap-2"><Button variant="outline" size="sm"><Icon name="MapPin" size={14} className="mr-2"/>Find Suppliers</Button><Button variant="outline" size="sm"><Icon name="Calendar" size={14} className="mr-2"/>Schedule</Button><Button variant="outline" size="sm"><Icon name="Share" size={14} className="mr-2"/>Share</Button></div></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-organic-md">
        <div className="p-4 sm:p-6 border-b border-border"><div className="flex items-center space-x-3"><div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0"><Icon name="Shield" size={20} className="text-accent" /></div><div><h2 className="text-lg font-semibold text-foreground">Prevention Tips</h2><p className="text-sm text-muted-foreground">Avoid future occurrences</p></div></div></div>
        <div className="p-4 sm:p-6"><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{results?.preventionTips?.map((tip, index) => <div key={index} className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg"><div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><Icon name="CheckCircle" size={14} className="text-accent" /></div><p className="text-sm text-muted-foreground leading-relaxed">{tip}</p></div>)}</div></div>
      </div>
    </div>
  );
};

export default AnalysisResults;