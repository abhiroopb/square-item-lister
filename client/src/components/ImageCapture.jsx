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
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setUseCamera(true);
    } catch (err) {
      setError('Failed to access camera: ' + err.message);
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

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        updateItem({ originalImage: e.target.result });
      };
      reader.readAsDataURL(file);

      // Upload to server
      const uploadResult = await api.uploadImage(file);
      
      if (uploadResult.success) {
        updateItem({ 
          imagePath: uploadResult.imagePath,
          filename: uploadResult.filename 
        });
      } else {
        setError('Failed to upload image');
      }
    } catch (err) {
      setError('Error uploading image: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="image-capture">
      <h2>📸 Step 1: Capture or Upload Image</h2>
      
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
