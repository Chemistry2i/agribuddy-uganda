import React, { useState, useRef, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const CameraInterface = ({ onImageCapture, isAnalyzing }) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } });
      if (videoRef?.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setCameraActive(true);
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      alert('Camera access is required. Please enable camera permissions in your browser settings.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream?.getTracks()?.forEach(track => track?.stop());
      setStream(null);
    }
    setCameraActive(false);
  }, [stream]);

  const captureImage = useCallback(() => {
    if (!videoRef?.current || !canvasRef?.current) return;
    const canvas = canvasRef?.current;
    const video = videoRef?.current;
    const context = canvas?.getContext('2d');
    canvas.width = video?.videoWidth;
    canvas.height = video?.videoHeight;
    context?.drawImage(video, 0, 0);
    canvas?.toBlob((blob) => {
      const imageUrl = URL.createObjectURL(blob);
      setCapturedImage(imageUrl);
      onImageCapture(blob, imageUrl);
      stopCamera();
    }, 'image/jpeg', 0.8);
  }, [onImageCapture, stopCamera]);

  const handleFileUpload = useCallback((event) => {
    const file = event?.target?.files?.[0];
    if (file && file?.type?.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setCapturedImage(imageUrl);
      onImageCapture(file, imageUrl);
    }
  }, [onImageCapture]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    if (capturedImage) URL.revokeObjectURL(capturedImage);
  }, [capturedImage]);

  return (
    <div className="bg-card rounded-xl border border-border shadow-organic-md overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="flex items-center space-x-3 mb-3 sm:mb-0">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0"><Icon name="Camera" size={20} className="text-primary" /></div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Plant Disease Scanner</h2>
              <p className="text-sm text-muted-foreground">Capture or upload an image for AI analysis</p>
            </div>
          </div>
          {cameraActive && <Button variant="outline" size="sm" onClick={stopCamera}><Icon name="X" size={14} className="mr-2"/>Stop Camera</Button>}
        </div>
      </div>
      <div className="p-4 sm:p-6">
        {!cameraActive && !capturedImage && (
          <div className="space-y-4 sm:space-y-6">
            <div className="relative aspect-video bg-muted rounded-lg border-2 border-dashed border-border flex items-center justify-center p-4">
              <div className="text-center space-y-2"><div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto"><Icon name="Camera" size={32} className="text-primary" /></div><div><h3 className="text-base sm:text-lg font-medium text-foreground mb-1">Ready to Scan</h3><p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">Position your camera to capture a clear image of the affected plant part</p></div></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button size="lg" onClick={startCamera} className="h-12 sm:h-14"><Icon name="Camera" size={16} className="mr-2"/>Start Camera</Button>
              <Button variant="outline" size="lg" onClick={() => fileInputRef?.current?.click()} className="h-12 sm:h-14"><Icon name="Upload" size={16} className="mr-2"/>Upload Image</Button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </div>
        )}

        {cameraActive && (
          <div className="space-y-4 sm:space-y-6">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="w-48 h-48 sm:w-64 sm:h-64 border-2 border-primary/60 rounded-lg relative"><div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary"></div><div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary"></div><div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary"></div><div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary"></div></div></div>
              <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4"><div className="bg-black/60 backdrop-blur-sm rounded-lg p-2 sm:p-3"><p className="text-white text-xs sm:text-sm text-center">Position the affected plant part within the frame</p></div></div>
            </div>
            <div className="flex justify-center"><Button size="xl" onClick={captureImage} disabled={isAnalyzing} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary hover:bg-primary/90 grow-on-hover"><Icon name="Camera" size={32} color="white" /></Button></div>
          </div>
        )}

        {capturedImage && (
          <div className="space-y-4 sm:space-y-6">
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image src={capturedImage} alt="Captured plant image" className="w-full h-full object-cover" />
              {isAnalyzing && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><div className="bg-white rounded-lg p-4 text-center shadow-lg"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div><p className="text-sm font-medium text-foreground">Analyzing...</p></div></div>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button variant="outline" size="lg" onClick={retakePhoto} disabled={isAnalyzing}><Icon name="RotateCcw" size={16} className="mr-2"/>Retake</Button>
              <Button variant="outline" size="lg" onClick={() => fileInputRef?.current?.click()} disabled={isAnalyzing}><Icon name="Upload" size={16} className="mr-2"/>Upload New</Button>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default CameraInterface;