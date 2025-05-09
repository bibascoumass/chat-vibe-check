import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';
import logo from './assets/images.jpeg';
import './assets/Dashboard.css';

function Dashboard() {
  const [file, setFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showBackdrop, setShowBackdrop] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert('Please choose a chat file first.');
    const formData = new FormData();
    formData.append('chat', file);

    try {
      const res = await axios.post(config.uploadEndpoint, formData);
      setMessages(res.data.messages);
      setShowBackdrop(true);
    } catch (err) {
      alert('Upload failed.');
      console.error(err);
    }
  };

  return (
    <div className="dashboardContainer">
      <div className="uploadContent">
        <div className="leftPanel">
          <h2>Upload WhatsApp Chat</h2>
          <p className="description">
            Analyze the emotional vibe of your group chats using our sentiment analyzer.
            Just upload the exported chat file and get started!
          </p>

          <label htmlFor="fileUpload" className="customFileUpload">Choose Chat File</label>
          <input
            id="fileUpload"
            type="file"
            accept=".txt"
            onChange={(e) => setFile(e.target.files[0])}
            className="fileInputHidden"
          />
          {file && <p className="fileName">✅ {file.name}</p>}
          <div>
            <button className="uploadButton" onClick={handleUpload}>📤 Upload Chat</button>
          </div>
        </div>

        <div className="rightPanel">
          <img src={logo} alt="Chat Analyzer Illustration" className="dashboardImage" />
        </div>
      </div>

      {showBackdrop && (
        <div className="backdrop">
          <div className="backdropContent">
            <h2>🎉 Upload Successful!</h2>
            <p>Your chat file has been processed successfully.</p>
            <button className="closeButton1" onClick={() => setShowBackdrop(false)}>Close</button>
          </div>
        </div>
      )}
    </div >
  );
}

export default Dashboard;
