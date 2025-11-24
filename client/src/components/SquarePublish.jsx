import { useItem } from '../context/ItemContext';
import { api } from '../services/api';

export function SquarePublish() {
  const { item, setLoading, setError, setSuccess, resetItem } = useItem();

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

  if (!item.title) return null;

  return (
    <div className="square-publish">
      <h2>💰 Step 4: Publish to Square</h2>
      
      <div className="item-summary">
        <h3>Item Summary</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <strong>Title:</strong> {item.title}
          </div>
          <div className="summary-item">
            <strong>Price:</strong> ${item.price.toFixed(2)}
          </div>
          <div className="summary-item">
            <strong>Description:</strong> {item.description || 'None'}
          </div>
        </div>
      </div>

      <div className="publish-actions">
        <button onClick={handlePublish} className="btn btn-success">
          🚀 Create Square Listing
        </button>
        
        <button onClick={handleReset} className="btn btn-secondary">
          🔄 Start Over
        </button>
      </div>
    </div>
  );
}
