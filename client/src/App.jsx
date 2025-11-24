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
          <h1>📦 Square Item Lister</h1>
          <p>AI-powered product listing creator</p>
          {hasApiKeys && (
            <button 
              className="reset-keys-btn"
              onClick={handleResetKeys}
              title="Change API Keys"
            >
              🔑 Change Keys
            </button>
          )}
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
              <p>Powered by OpenAI & Square API</p>
            </footer>
          </>
        )}
      </div>
    </ItemProvider>
  );
}

export default App;
