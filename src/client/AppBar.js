import React from 'react';
import './assets/AppBar.css';

function AppBar() {
  return (
    <header className="appBar">
      <div className="logoSection">
        <span className="chatIcon">💬</span>
      <span className="appName">Chat Vibe Analyser</span>
      </div>
      <nav className="navMenu">
        <button onClick={() => window.location.href = "#/heatmap"}>📊 HeatMap</button>
        <button onClick={() => window.location.href = "#/scatterplots"}>📊 ScatterPlot</button>
        <button onClick={() => window.location.href = "#/sentiment_analyser"}>📈 Sentiment Analyzer</button>
      </nav>
    </header>
  );
}

export default AppBar;
