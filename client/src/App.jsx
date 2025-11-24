import { ItemProvider } from './context/ItemContext';
import { ImageCapture } from './components/ImageCapture';
import { ImagePreview } from './components/ImagePreview';
import { ItemForm } from './components/ItemForm';
import { SquarePublish } from './components/SquarePublish';
import { StatusBar } from './components/StatusBar';
import './App.css';

function App() {
  return (
    <ItemProvider>
      <div className="app">
        <header className="app-header">
          <h1>📦 Square Item Lister</h1>
          <p>AI-powered product listing creator</p>
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
      </div>
    </ItemProvider>
  );
}

export default App;
