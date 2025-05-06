import React from 'react';
import ReactDOM from 'react-dom/client';
import './client/assets/index.css';
import Dashboard from './client/App';
import reportWebVitals from './client/reportWebVitals';
import SentimentHeatmap from './client/SentimentHeatmap';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppBar from './client/AppBar';
import SentimentAnalyser from './client/SentimentAnalyser';
import SentimentScatterPlot from './client/SentimentScatterPlot';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppBar />
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
        <Route path="/heatmap" element={<SentimentHeatmap />} />
        <Route path="/scatterplots" element={<SentimentScatterPlot />} />
        <Route path="/sentiment_analyser" element={<SentimentAnalyser />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
