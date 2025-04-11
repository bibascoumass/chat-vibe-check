
import React from 'react';
import './AppBar.css';

function AppBar() {
  return (
    <header className="appBar">
      <div className="logoSection">
        <span className="chatIcon">💬</span>
        <span className="appName">Chat Vibe Analyser</span>
      </div>
      <nav className="navMenu">
        <button onClick={() => window.location.href = "/plots"}>📊 HeatMap</button>
        <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>📈 Sentiment Analyzer</button>
      </nav>
    </header>
  );
}

export default AppBar;