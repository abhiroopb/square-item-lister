import { useItem } from '../context/ItemContext';
import { api } from '../services/api';

export function ImagePreview() {
  const { item, updateItem, setLoading, setError } = useItem();

  const handleRegenerate = async () => {
    if (!item.imagePath) return;

    try {
      setLoading(true);
      setError(null);
      console.log('Regenerating...');

      // Step 1: Re-enhance image
      const enhanceResult = await api.enhanceImage(item.imagePath);
      console.log('Enhance result:', enhanceResult);
      
      if (enhanceResult.success) {
        // Load enhanced image
        const enhancedUrl = `${import.meta.env.VITE_API_URL || '/api'}/uploads/${enhanceResult.enhancedPath.split('/').pop()}`;
        updateItem({ 
          enhancedImage: enhancedUrl,
          enhancedPath: enhanceResult.enhancedPath 
        });

        // Step 2: Re-analyze with AI
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
        setError('Failed to regenerate: ' + (enhanceResult.error || 'Unknown error'));
      }
    } catch (err) {
      setError('Error regenerating: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!item.originalImage) return null;

  return (
    <div className="image-preview">
      <div className="image-comparison">
        <div className="image-box">
          <h3>Original</h3>
          <img src={item.originalImage} alt="Original" />
        </div>
        
        {item.enhancedImage && (
          <div className="image-box">
            <h3>Studio Quality</h3>
            <img src={item.enhancedImage} alt="Enhanced" />
          </div>
        )}
      </div>
      
      {item.enhancedImage && (
        <div className="regenerate-section">
          <button onClick={handleRegenerate} className="btn btn-secondary">
            🔄 Regenerate Image
          </button>
        </div>
      )}
    </div>
  );
}
