import { useItem } from '../context/ItemContext';

export function StatusBar() {
  const { loading, error, success, setError, setSuccess } = useItem();

  if (!loading && !error && !success) return null;

  return (
    <div className="status-bar">
      {loading && (
        <div className="status loading">
          <div className="spinner"></div>
          <span>Processing...</span>
        </div>
      )}
      
      {error && (
        <div className="status error">
          <span>❌ {error}</span>
          <button onClick={() => setError(null)} className="close-btn">×</button>
        </div>
      )}
      
      {success && (
        <div className="status success">
          <span>{success}</span>
          <button onClick={() => setSuccess(null)} className="close-btn">×</button>
        </div>
      )}
    </div>
  );
}
