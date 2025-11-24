import { useEffect } from 'react';
import { useItem } from '../context/ItemContext';
import { api } from '../services/api';

export function ItemForm() {
  const { item, updateItem, setLoading, setError } = useItem();

  useEffect(() => {
    // Auto-analyze when enhanced image is ready OR when original image is uploaded
    if ((item.enhancedPath || item.imagePath) && !item.title) {
      analyzeImage();
    }
  }, [item.enhancedPath, item.imagePath]);

  const analyzeImage = async () => {
    const imagePath = item.enhancedPath || item.imagePath;
    if (!imagePath) {
      console.log('No image path available for analysis');
      return;
    }

    console.log('Starting AI analysis for image:', imagePath);

    try {
      setLoading(true);
      setError(null);

      const result = await api.analyzeImage(imagePath);
      console.log('AI analysis result:', result);
      
      if (result.success) {
        updateItem({
          title: result.title,
          description: result.description,
          price: result.suggestedPrice || 0
        });
        console.log('Item updated with AI results');
      } else {
        const errorMsg = 'Failed to analyze image: ' + (result.error || 'Unknown error');
        console.error(errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg = 'Error analyzing image: ' + err.message;
      console.error(errorMsg, err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    updateItem({ [field]: value });
  };

  if (!item.originalImage) return null;

  return (
    <div className="item-form">
      <h2>🤖 Step 3: Review & Edit Details</h2>
      
      {!item.title && (
        <button onClick={analyzeImage} className="btn btn-primary">
          🔍 Generate with AI
        </button>
      )}

      {item.title && (
        <form>
          <div className="form-group">
            <label htmlFor="title">Item Title</label>
            <input
              id="title"
              type="text"
              value={item.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter item title"
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price ($)</label>
            <input
              id="price"
              type="number"
              value={item.price}
              onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={item.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter item description"
              rows={5}
            />
          </div>
        </form>
      )}
    </div>
  );
}
