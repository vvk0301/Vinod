import React, { useState, useEffect } from 'react';
import ChatWindow from './components/ChatWindow';
import './App.css';

function App() {
  const [sessionId] = useState(() => 
    `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );

  useEffect(() => {
    // Check backend health on startup
    const checkBackendHealth = async () => {
      try {
        const response = await fetch('/health');
        if (response.ok) {
          console.log('✅ Backend connection established');
        }
      } catch (error) {
        console.warn('⚠️ Backend not available, using mock mode');
      }
    };

    checkBackendHealth();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1 className="university-title">
            🎓 University Assistant
          </h1>
          <p className="university-subtitle">
            Your guide to academics, admissions, campus life, and more
          </p>
        </div>
      </header>

      <main className="App-main">
        <ChatWindow sessionId={sessionId} />
      </main>

      <footer className="App-footer">
        <p>
          University Chatbot • Powered by Azure OpenAI • 
          <a 
            href="https://github.com/your-repo/university-chatbot" 
            target="_blank" 
            rel="noopener noreferrer"
            className="github-link"
          >
            View on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;