import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Dashboard from './App';
import reportWebVitals from './reportWebVitals';
import SentimentHeatmap from './SentimentHeatmap';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppBar from './AppBar';
import SentimentAnalyser from './SentimentAnalyser';
import SentimentScatterPlot from './SentimentScatterPlot';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppBar />
      <Routes>
        {/* <Route exact path="/" element={<Dashboard />} /> */}
        <Route path="/" element={<Navigate to="/heatmap" replace />} />
        <Route exact path="/heatmap" element={<SentimentHeatmap />} />
        <Route path="/scatterplots" element={<SentimentScatterPlot />} />
        <Route path="/sentiment_analyser" element={<SentimentAnalyser />} />
      </Routes> 
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
