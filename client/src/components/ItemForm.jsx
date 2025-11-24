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
    if (!imagePath) return;

    try {
      setLoading(true);
      setError(null);

      const result = await api.analyzeImage(imagePath);
      
      if (result.success) {
        updateItem({
          title: result.title,
          description: result.description,
          price: result.suggestedPrice || 0
        });
      } else {
        setError('Failed to analyze image');
      }
    } catch (err) {
      setError('Error analyzing image: ' + err.message);
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
