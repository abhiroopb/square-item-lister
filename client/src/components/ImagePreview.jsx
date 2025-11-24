import { useItem } from '../context/ItemContext';
import { api } from '../services/api';

export function ImagePreview() {
  const { item, updateItem, setLoading, setError } = useItem();

  const handleEnhance = async () => {
    if (!item.imagePath) return;

    try {
      setLoading(true);
      setError(null);

      const result = await api.enhanceImage(item.imagePath);
      
      if (result.success) {
        // Load enhanced image
        const enhancedUrl = `/uploads/${result.enhancedPath.split('/').pop()}`;
        updateItem({ 
          enhancedImage: enhancedUrl,
          enhancedPath: result.enhancedPath 
        });
      } else {
        setError('Failed to enhance image');
      }
    } catch (err) {
      setError('Error enhancing image: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!item.originalImage) return null;

  return (
    <div className="image-preview">
      <h2>✨ Enhance Image (Optional)</h2>
      
      <div className="image-comparison">
        <div className="image-box">
          <h3>Original</h3>
          <img src={item.originalImage} alt="Original" />
        </div>
        
        {item.enhancedImage && (
          <div className="image-box">
            <h3>Enhanced</h3>
            <img src={item.enhancedImage} alt="Enhanced" />
          </div>
        )}
      </div>

      {!item.enhancedImage && (
        <button onClick={handleEnhance} className="btn btn-primary">
          ✨ Enhance Image
        </button>
      )}
    </div>
  );
}
