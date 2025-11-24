import { useItem } from '../context/ItemContext';
import { api } from '../services/api';

export function ItemForm() {
  const { item, updateItem, setLoading, setError, setSuccess, resetItem } = useItem();

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

  const handlePublish = async () => {
    if (!item.title || !item.price) {
      setError('Please fill in title and price');
      return;
    }

    const imagePath = item.enhancedPath || item.imagePath;
    if (!imagePath) {
      setError('No image available');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await api.createSquareItem({
        title: item.title,
        description: item.description,
        price: item.price,
        imagePath: imagePath
      });

      if (result.success) {
        setSuccess(`✅ Item created successfully! Item ID: ${result.itemId}`);
      } else {
        setError('Failed to create item in Square: ' + result.error);
      }
    } catch (err) {
      setError('Error creating item: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (confirm('Start over with a new item?')) {
      resetItem();
    }
  };

  const handleChange = (field, value) => {
    updateItem({ [field]: value });
  };

  if (!item.originalImage) return null;

  return (
    <div className="item-form">
      {!item.title && (
        <button onClick={analyzeImage} className="btn btn-primary">
          🔍 Generate with AI
        </button>
      )}

      {item.title && (
        <>
          <form className="item-details-form">
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

          <div className="form-actions">
            <button onClick={analyzeImage} className="btn btn-secondary">
              🔄 Regenerate Details
            </button>
            <button onClick={handlePublish} className="btn btn-success">
              🚀 Create Square Listing
            </button>
          </div>

          <div className="reset-section">
            <button onClick={handleReset} className="btn-link">
              Start over with a new item
            </button>
          </div>
        </>
      )}
    </div>
  );
}
