import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Dashboard from './App';
import reportWebVitals from './reportWebVitals';
import SentimentHeatmap from './SentimentHeatmap';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppBar from './AppBar';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppBar />
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
        <Route path="/plots" element={<SentimentHeatmap />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();