import React from 'react';
import ReactDOM from 'react-dom/client';
import './client/assets/index.css';
import Dashboard from './client/App';
import reportWebVitals from './client/reportWebVitals';
import SentimentHeatmap from './client/SentimentHeatmap';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppBar from './client/AppBar';
import SentimentAnalyser from './client/SentimentAnalyser';
import SentimentScatterPlot from './client/SentimentScatterPlot';
import config from './config.json';
export default config;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <AppBar />
      <Routes>
        {/* <Route exact path="/" element={<Dashboard />} /> */}
        <Route path="/" element={<Navigate to="/heatmap" replace />} />
        <Route exact path="/heatmap" element={<SentimentHeatmap />} />
        <Route path="/scatterplots" element={<SentimentScatterPlot />} />
        <Route path="/sentiment_analyser" element={<SentimentAnalyser />} />
      </Routes> 
    </HashRouter>
  </React.StrictMode>
);

reportWebVitals();
