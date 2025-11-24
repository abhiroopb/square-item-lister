import { useState } from 'react';
import './ApiKeySetup.css';

export function ApiKeySetup({ onSubmit }) {
  const [squareToken, setSquareToken] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!squareToken.trim()) {
      setError('Please enter your Square Sandbox Access Token');
      return;
    }
    
    if (!openaiKey.trim()) {
      setError('Please enter your OpenAI API Key');
      return;
    }

    // Save to localStorage
    localStorage.setItem('squareToken', squareToken.trim());
    localStorage.setItem('openaiKey', openaiKey.trim());
    
    setError('');
    onSubmit();
  };

  return (
    <div className="api-key-setup">
      <div className="setup-container">
        <div className="setup-header">
          <h2>🔑 Step 1: Configure API Keys</h2>
          <p>Enter your API credentials to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="setup-form">
          <div className="form-group">
            <label htmlFor="squareToken">
              Square Sandbox Access Token
              <span className="required">*</span>
            </label>
            <input
              id="squareToken"
              type="text"
              value={squareToken}
              onChange={(e) => setSquareToken(e.target.value)}
              placeholder="EAAAl..."
              className="form-input"
            />
            <small className="form-hint">
              Get your token from the{' '}
              <a 
                href="https://developer.squareup.com/apps" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Square Developer Dashboard
              </a>
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="openaiKey">
              OpenAI API Key
              <span className="required">*</span>
            </label>
            <input
              id="openaiKey"
              type="password"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="sk-proj-..."
              className="form-input"
            />
            <small className="form-hint">
              Get your API key from{' '}
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                OpenAI Platform
              </a>
            </small>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-btn">
            Continue to Image Upload →
          </button>
        </form>

        <div className="setup-info">
          <h3>ℹ️ About Your Keys</h3>
          <ul>
            <li>Your API keys are stored locally in your browser</li>
            <li>Keys are never sent to any server except Square and OpenAI</li>
            <li>You can change your keys anytime using the "Change Keys" button</li>
            <li>Use Square Sandbox tokens for testing</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
