import { useState } from 'react';
import { ItemProvider } from './context/ItemContext';
import { ImageCapture } from './components/ImageCapture';
import { ImagePreview } from './components/ImagePreview';
import { ItemForm } from './components/ItemForm';
import { SquarePublish } from './components/SquarePublish';
import { StatusBar } from './components/StatusBar';
import { SettingsModal } from './components/SettingsModal';
import './App.css';

function App() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <ItemProvider>
      <div className="app">
        <header className="app-header">
          <h1>📦 Square Item Lister</h1>
          <p>AI-powered product listing creator</p>
          <button 
            className="settings-btn" 
            onClick={() => setShowSettings(true)}
            title="Configure API Keys"
          >
            ⚙️ Settings
          </button>
        </header>

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

        <SettingsModal 
          isOpen={showSettings} 
          onClose={() => setShowSettings(false)} 
        />
      </div>
    </ItemProvider>
  );
}

export default App;
