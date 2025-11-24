import { useItem } from '../context/ItemContext';
import { api } from '../services/api';

export function ImagePreview() {
  const { item, updateItem, setLoading, setError } = useItem();

  const handleToggleImage = () => {
    updateItem({ useOriginalImage: !item.useOriginalImage });
  };

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
        // Load enhanced image - construct proper URL
        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
        const filename = enhanceResult.enhancedPath.split('/').pop();
        const enhancedUrl = apiBase.replace('/api', '') + '/uploads/' + filename;
        
        console.log('Enhanced image URL:', enhancedUrl);
        
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
        <div className={`image-box ${item.useOriginalImage ? 'selected' : ''}`}>
          <h3>Original</h3>
          <img src={item.originalImage} alt="Original" />
          {item.useOriginalImage && (
            <div className="selected-badge">✓ Selected</div>
          )}
        </div>
        
        {item.enhancedImage && (
          <div className={`image-box ${!item.useOriginalImage ? 'selected' : ''}`}>
            <h3>
              Studio Quality
              <button 
                onClick={handleRegenerate} 
                className="regenerate-icon-btn"
                title="Regenerate enhanced image"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13.65 2.35C12.2 0.9 10.21 0 8 0C3.58 0 0.01 3.58 0.01 8C0.01 12.42 3.58 16 8 16C11.73 16 14.84 13.45 15.73 10H13.65C12.83 12.33 10.61 14 8 14C4.69 14 2 11.31 2 8C2 4.69 4.69 2 8 2C9.66 2 11.14 2.69 12.22 3.78L9 7H16V0L13.65 2.35Z" fill="currentColor"/>
                </svg>
              </button>
            </h3>
            <img src={item.enhancedImage} alt="Enhanced" />
            {!item.useOriginalImage && (
              <div className="selected-badge">✓ Selected</div>
            )}
          </div>
        )}
      </div>

      {item.enhancedImage && (
        <div className="image-actions">
          <button onClick={handleToggleImage} className="btn btn-secondary">
            {item.useOriginalImage ? '✨ Use AI Enhanced Image' : '📷 Use Original Image'}
          </button>
        </div>
      )}
    </div>
  );
}
