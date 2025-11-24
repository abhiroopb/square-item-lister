import { useState, useEffect } from 'react';
import { ItemProvider } from './context/ItemContext';
import { ImageCapture } from './components/ImageCapture';
import { ImagePreview } from './components/ImagePreview';
import { ItemForm } from './components/ItemForm';
import { SquarePublish } from './components/SquarePublish';
import { StatusBar } from './components/StatusBar';
import { ApiKeySetup } from './components/ApiKeySetup';
import './App.css';

function App() {
  const [hasApiKeys, setHasApiKeys] = useState(false);

  useEffect(() => {
    // Check if API keys are already stored
    const squareToken = localStorage.getItem('squareToken');
    const openaiKey = localStorage.getItem('openaiKey');
    setHasApiKeys(!!squareToken && !!openaiKey);
  }, []);

  const handleApiKeysSubmit = () => {
    setHasApiKeys(true);
  };

  const handleResetKeys = () => {
    localStorage.removeItem('squareToken');
    localStorage.removeItem('openaiKey');
    setHasApiKeys(false);
  };

  return (
    <ItemProvider>
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <div className="header-title">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="8" fill="#006AFF"/>
                <path d="M8 12C8 10.8954 8.89543 10 10 10H14C15.1046 10 16 10.8954 16 12V16C16 17.1046 15.1046 18 14 18H10C8.89543 18 8 17.1046 8 16V12Z" fill="white"/>
                <path d="M18 12C18 10.8954 18.8954 10 20 10H22C23.1046 10 24 10.8954 24 12V16C24 17.1046 23.1046 18 22 18H20C18.8954 18 18 17.1046 18 16V12Z" fill="white"/>
                <path d="M8 20C8 18.8954 8.89543 18 10 18H14C15.1046 18 16 18.8954 16 20V22C16 23.1046 15.1046 24 14 24H10C8.89543 24 8 23.1046 8 22V20Z" fill="white"/>
              </svg>
              <div>
                <h1>Square Item Lister</h1>
                <p>AI-powered product listing creator</p>
              </div>
            </div>
            {hasApiKeys && (
              <button 
                className="reset-keys-btn"
                onClick={handleResetKeys}
                title="Change API Keys"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 3.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM2 8a6 6 0 1110.89 3.476l4.817 4.817a.75.75 0 01-1.06 1.06l-4.816-4.816A6 6 0 012 8z"/>
                </svg>
                Change Keys
              </button>
            )}
          </div>
        </header>
        
        {!hasApiKeys ? (
          <ApiKeySetup onSubmit={handleApiKeysSubmit} />
        ) : (
          <>
            <StatusBar />
            <main className="app-main">
              <ImageCapture />
              <ImagePreview />
              <ItemForm />
              <SquarePublish />
            </main>
            <footer className="app-footer">
              <p>© 2024 Square, Inc. • Powered by OpenAI & Square API</p>
            </footer>
          </>
        )}
      </div>
    </ItemProvider>
  );
}

export default App;
