import { useItem } from '../context/ItemContext';
import { api } from '../services/api';

export function ItemForm() {
  const { item, updateItem, setLoading, setError, setSuccess, resetItem } = useItem();

  const regenerateTitle = async () => {
    const imagePath = item.enhancedPath || item.imagePath;
    if (!imagePath) return;

    try {
      setLoading(true);
      setError(null);
      const result = await api.analyzeImage(imagePath);
      if (result.success) {
        updateItem({ title: result.title });
      }
    } catch (err) {
      setError('Error regenerating title: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const regenerateDescription = async () => {
    const imagePath = item.enhancedPath || item.imagePath;
    if (!imagePath) return;

    try {
      setLoading(true);
      setError(null);
      const result = await api.analyzeImage(imagePath);
      if (result.success) {
        updateItem({ description: result.description });
      }
    } catch (err) {
      setError('Error regenerating description: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const regeneratePrice = async () => {
    const imagePath = item.enhancedPath || item.imagePath;
    if (!imagePath) return;

    try {
      setLoading(true);
      setError(null);
      const result = await api.analyzeImage(imagePath);
      if (result.success) {
        updateItem({ price: result.suggestedPrice || 0 });
      }
    } catch (err) {
      setError('Error regenerating price: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!item.title || !item.price) {
      setError('Please fill in title and price');
      return;
    }

    // Use original image if user toggled to it, otherwise use enhanced
    const imagePath = item.useOriginalImage 
      ? item.imagePath 
      : (item.enhancedPath || item.imagePath);
    
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
        updateItem({ squareItemId: result.itemId });
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
  if (!item.title) return null; // Don't show anything until AI generates details

  return (
    <div className="item-form">
      <form className="item-details-form">
        <div className="form-group">
          <label htmlFor="title">
            Item Title
            <button 
              type="button"
              onClick={regenerateTitle} 
              className="regenerate-icon-btn"
              title="Regenerate title"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13.65 2.35C12.2 0.9 10.21 0 8 0C3.58 0 0.01 3.58 0.01 8C0.01 12.42 3.58 16 8 16C11.73 16 14.84 13.45 15.73 10H13.65C12.83 12.33 10.61 14 8 14C4.69 14 2 11.31 2 8C2 4.69 4.69 2 8 2C9.66 2 11.14 2.69 12.22 3.78L9 7H16V0L13.65 2.35Z" fill="currentColor"/>
              </svg>
            </button>
          </label>
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
          <label htmlFor="price">
            Price ($)
            <button 
              type="button"
              onClick={regeneratePrice} 
              className="regenerate-icon-btn"
              title="Regenerate price"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13.65 2.35C12.2 0.9 10.21 0 8 0C3.58 0 0.01 3.58 0.01 8C0.01 12.42 3.58 16 8 16C11.73 16 14.84 13.45 15.73 10H13.65C12.83 12.33 10.61 14 8 14C4.69 14 2 11.31 2 8C2 4.69 4.69 2 8 2C9.66 2 11.14 2.69 12.22 3.78L9 7H16V0L13.65 2.35Z" fill="currentColor"/>
              </svg>
            </button>
          </label>
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
          <label htmlFor="description">
            Description
            <button 
              type="button"
              onClick={regenerateDescription} 
              className="regenerate-icon-btn"
              title="Regenerate description"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13.65 2.35C12.2 0.9 10.21 0 8 0C3.58 0 0.01 3.58 0.01 8C0.01 12.42 3.58 16 8 16C11.73 16 14.84 13.45 15.73 10H13.65C12.83 12.33 10.61 14 8 14C4.69 14 2 11.31 2 8C2 4.69 4.69 2 8 2C9.66 2 11.14 2.69 12.22 3.78L9 7H16V0L13.65 2.35Z" fill="currentColor"/>
              </svg>
            </button>
          </label>
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
        <button onClick={handlePublish} className="btn btn-success">
          🚀 Create Square Listing
        </button>
      </div>

      {item.squareItemId && (
        <div className="form-actions">
          <a 
            href={`https://app.squareupsandbox.com/dashboard/items/library/${item.squareItemId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            📦 View Item in Square
          </a>
        </div>
      )}

      <div className="reset-section">
        <button onClick={handleReset} className="btn btn-secondary">
          Start over with a new item
        </button>
      </div>
    </div>
  );
}
