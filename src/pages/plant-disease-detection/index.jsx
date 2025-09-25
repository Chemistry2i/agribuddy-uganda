import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import CameraInterface from './components/CameraInterface';
import AnalysisResults from './components/AnalysisResults';
import DiagnosisHistory from './components/DiagnosisHistory';
import QuickTips from './components/QuickTips';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const PlantDiseaseDetection = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [activeView, setActiveView] = useState('scanner');

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

  // Mock analysis function
  const performAnalysis = async (imageBlob, imageUrl) => {
    setIsAnalyzing(true);
    setCapturedImage(imageUrl);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockResults = {
      disease: 'Coffee Leaf Rust',
      cropType: 'Coffee (Coffea arabica)',
      confidence: 89,
      description: `A fungal disease caused by Hemileia vastatrix, appearing as orange-yellow powdery spots on leaves, leading to leaf drop and reduced yields. Thrives in humid, rainy conditions.`,
      treatments: [
        { type: 'organic', name: 'Copper-based Fungicide', availability: 'Available', instructions: `Mix 2-3g per liter of water. Spray early morning or late evening. Ensure complete leaf coverage. Apply every 14 days during wet season.`, dosage: '2-3g / liter', timing: 'Every 14 days', cost: 'UGX 15k - 25k' },
        { type: 'chemical', name: 'Systemic Triazole Fungicide', availability: 'Agro-dealers', instructions: `Use propiconazole or tebuconazole. Mix per instructions. Spray in dry weather. Rotate with copper-based treatments.`, dosage: '1-2ml / liter', timing: 'Monthly', cost: 'UGX 35k - 50k' }
      ],
      preventionTips: [
        'Maintain proper spacing for air circulation',
        'Remove and destroy infected leaves immediately',
        'Apply mulch to reduce soil splash',
        'Use drip irrigation instead of overhead',
        'Plant resistant varieties (e.g., Ruiru 11)',
        'Regular pruning for better air flow'
      ]
    };
    
    setAnalysisResults(mockResults);
    setIsAnalyzing(false);
  };

  const handleImageCapture = (imageBlob, imageUrl) => {
    performAnalysis(imageBlob, imageUrl);
  };

  const handleNewScan = () => {
    setAnalysisResults(null);
    setCapturedImage(null);
    setActiveView('scanner');
  };

  const handleSelectDiagnosis = (diagnosis) => {
    console.log('Selected diagnosis:', diagnosis);
  };

  const viewOptions = [
    { id: 'scanner', label: 'Scanner', icon: 'Camera' },
    { id: 'history', label: 'History', icon: 'History' },
    { id: 'tips', label: 'Tips', icon: 'Lightbulb' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header onToggleSidebar={() => setSidebarExpanded(!sidebarExpanded)} sidebarExpanded={sidebarExpanded} userRole="farmer" />
      <Sidebar isExpanded={sidebarExpanded} onToggle={() => setSidebarExpanded(!sidebarExpanded)} userRole="farmer" />
      <main className={`transition-all duration-300 ${isMobile ? 'ml-0 pb-20' : sidebarExpanded ? 'lg:ml-80' : 'lg:ml-16'} pt-16`}>
        <div className="p-4 sm:p-6 space-y-6 max-w-8xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0"><Icon name="Bug" size={24} className="text-primary" /></div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Plant Disease Detection</h1>
                <p className="text-muted-foreground text-sm sm:text-base">AI-powered crop health analysis</p>
              </div>
            </div>
            {analysisResults && <Button onClick={handleNewScan}><Icon name="Plus" size={16} className="mr-2" />New Scan</Button>}
          </div>

          <div className="-mb-2">
            <div className="flex space-x-1 bg-muted p-1 rounded-lg overflow-x-auto">
              {viewOptions?.map((option) => (
                <Button key={option?.id} variant={activeView === option?.id ? "default" : "ghost"} size="sm" onClick={() => setActiveView(option?.id)} className="flex-1 justify-center whitespace-nowrap"><Icon name={option?.icon} size={16} className="mr-2" />{option?.label}</Button>
              ))}
            </div>
          </div>

          {activeView === 'scanner' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2"><CameraInterface onImageCapture={handleImageCapture} isAnalyzing={isAnalyzing} /></div>
              <div className="lg:col-span-1"><AnalysisResults results={analysisResults} isAnalyzing={isAnalyzing} capturedImage={capturedImage} /></div>
            </div>
          )}

          {activeView === 'history' && <div className="max-w-6xl mx-auto"><DiagnosisHistory onSelectDiagnosis={handleSelectDiagnosis} /></div>}
          {activeView === 'tips' && <div className="max-w-6xl mx-auto"><QuickTips /></div>}

          {activeView === 'scanner' && (
            <div className="mt-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card rounded-lg border border-border p-4 text-center"><div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2"><Icon name="Scan" size={16} className="text-primary" /></div><div className="text-2xl font-bold text-foreground">156</div><div className="text-sm text-muted-foreground">Total Scans</div></div>
                <div className="bg-card rounded-lg border border-border p-4 text-center"><div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-2"><Icon name="CheckCircle" size={16} className="text-success" /></div><div className="text-2xl font-bold text-foreground">92%</div><div className="text-sm text-muted-foreground">Accuracy</div></div>
                <div className="bg-card rounded-lg border border-border p-4 text-center"><div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-2"><Icon name="Activity" size={16} className="text-warning" /></div><div className="text-2xl font-bold text-foreground">23</div><div className="text-sm text-muted-foreground">Diseases</div></div>
                <div className="bg-card rounded-lg border border-border p-4 text-center"><div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-2"><Icon name="TrendingUp" size={16} className="text-accent" /></div><div className="text-2xl font-bold text-foreground">78%</div><div className="text-sm text-muted-foreground">Success</div></div>
              </div>
            </div>
          )}

          <div className="mt-8">
            <div className="bg-card rounded-xl border border-border shadow-organic-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                  <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center flex-shrink-0"><Icon name="AlertTriangle" size={20} className="text-error" /></div>
                  <div>
                    <h3 className="font-semibold text-foreground">Emergency Plant Health Support</h3>
                    <p className="text-sm text-muted-foreground">For severe disease outbreaks or urgent assistance</p>
                  </div>
                </div>
                <div className="flex space-x-2 w-full sm:w-auto">
                  <Button variant="outline" size="sm" className="flex-1"><Icon name="Phone" size={14} className="mr-2" />Call</Button>
                  <Button variant="outline" size="sm" className="flex-1"><Icon name="MessageSquare" size={14} className="mr-2"/>WhatsApp</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlantDiseaseDetection;