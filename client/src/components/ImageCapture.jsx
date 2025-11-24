import { useState, useRef } from 'react';
import { useItem } from '../context/ItemContext';
import { api } from '../services/api';

export function ImageCapture() {
  const { updateItem, setLoading, setError } = useItem();
  const [useCamera, setUseCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const startCamera = async () => {
    try {
      setError(null);
      const constraints = {
        video: { 
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setUseCamera(true);
      
      // Wait for next frame to ensure video element is rendered
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(e => {
            console.error('Error playing video:', e);
            setError('Failed to start camera preview: ' + e.message);
          });
        }
      }, 100);
    } catch (err) {
      console.error('Camera error:', err);
      setError('Failed to access camera: ' + err.message + '. Make sure you granted camera permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setUseCamera(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      canvas.toBlob(async (blob) => {
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        await handleFileUpload(file);
        stopCamera();
      }, 'image/jpeg');
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Uploading file:', file.name);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        updateItem({ originalImage: e.target.result });
        console.log('Preview image loaded');
      };
      reader.readAsDataURL(file);

      // Upload to server
      const uploadResult = await api.uploadImage(file);
      console.log('Upload result:', uploadResult);
      
      if (uploadResult.success) {
        // Automatically enhance and analyze
        await processImage(uploadResult.imagePath);
      } else {
        const errorMsg = 'Failed to upload image: ' + (uploadResult.error || 'Unknown error');
        console.error(errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg = 'Error uploading image: ' + err.message;
      console.error(errorMsg, err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const processImage = async (imagePath) => {
    try {
      setLoading(true);
      console.log('Processing image:', imagePath);

      // Step 1: Enhance image (remove background, studio quality)
      const enhanceResult = await api.enhanceImage(imagePath);
      console.log('Enhance result:', enhanceResult);
      
      if (enhanceResult.success) {
        // Load enhanced image - construct proper URL
        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
        const filename = enhanceResult.enhancedPath.split('/').pop();
        const enhancedUrl = apiBase.replace('/api', '') + '/uploads/' + filename;
        
        console.log('Enhanced image URL:', enhancedUrl);
        
        updateItem({ 
          imagePath: imagePath,
          enhancedImage: enhancedUrl,
          enhancedPath: enhanceResult.enhancedPath 
        });

        // Step 2: Analyze with AI
        const analysisResult = await api.analyzeImage(enhanceResult.enhancedPath);
        console.log('Analysis result:', analysisResult);
        
        if (analysisResult.success) {
          updateItem({
            title: analysisResult.title,
            description: analysisResult.description,
            price: analysisResult.suggestedPrice || 0
          });
        }
      } else {
        setError('Failed to enhance image: ' + (enhanceResult.error || 'Unknown error'));
      }
    } catch (err) {
      setError('Error processing image: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="image-capture">
      <h1 className="page-title">Capture or upload the image of your item</h1>
      
      {!useCamera ? (
        <div className="upload-options">
          <button onClick={startCamera} className="btn btn-primary">
            📷 Use Camera
          </button>
          
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="btn btn-secondary"
          >
            📁 Upload Image
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>
      ) : (
        <div className="camera-view">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline
            className="camera-preview"
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          
          <div className="camera-controls">
            <button onClick={capturePhoto} className="btn btn-primary">
              📸 Capture Photo
            </button>
            <button onClick={stopCamera} className="btn btn-secondary">
              ❌ Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
