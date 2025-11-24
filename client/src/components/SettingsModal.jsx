import { useState, useEffect } from 'react';

export function SettingsModal({ isOpen, onClose }) {
  const [squareToken, setSquareToken] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load saved tokens from localStorage
    const savedSquareToken = localStorage.getItem('squareToken') || '';
    const savedOpenaiKey = localStorage.getItem('openaiKey') || '';
    setSquareToken(savedSquareToken);
    setOpenaiKey(savedOpenaiKey);
  }, [isOpen]);

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('squareToken', squareToken);
    localStorage.setItem('openaiKey', openaiKey);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1500);
  };

  const handleClear = () => {
    localStorage.removeItem('squareToken');
    localStorage.removeItem('openaiKey');
    setSquareToken('');
    setOpenaiKey('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>⚙️ API Settings</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <p className="settings-description">
            Enter your own API keys to use this app with your Square and OpenAI accounts.
            Your keys are stored locally in your browser and never sent to our servers.
          </p>

          <div className="form-group">
            <label htmlFor="squareToken">
              Square Sandbox Access Token
              <span className="optional">(Required for creating items)</span>
            </label>
            <input
              id="squareToken"
              type="password"
              value={squareToken}
              onChange={(e) => setSquareToken(e.target.value)}
              placeholder="EAAAl..."
            />
            <small>
              Get your token from{' '}
              <a href="https://developer.squareup.com/apps" target="_blank" rel="noopener noreferrer">
                Square Developer Dashboard
              </a>
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="openaiKey">
              OpenAI API Key
              <span className="optional">(Required for AI features)</span>
            </label>
            <input
              id="openaiKey"
              type="password"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="sk-proj-..."
            />
            <small>
              Get your key from{' '}
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
                OpenAI Platform
              </a>
            </small>
          </div>

          {saved && (
            <div className="success-message">
              ✅ Settings saved successfully!
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={handleClear} className="btn btn-secondary">
            Clear All
          </button>
          <button onClick={handleSave} className="btn btn-primary">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
