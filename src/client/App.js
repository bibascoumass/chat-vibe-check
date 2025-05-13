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
      <h1>Welcome to Chat Vibe Check!</h1>
      <div className="videoWrapper">
        <iframe
          width="760"
          height="320"
          src="https://www.youtube.com/embed/kTXRjwRqz6w?si=0gqa9dFaHawi3yqU"
          title="YouTube video demo"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="linkWrapper">
        <p>
          View our process book on{' '}
          <a
            href="https://drive.google.com/file/d/1LPl7xny57IWIoSNrJ8RavohQcx18rxMP/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Drive
          </a>.
        </p>
      </div>
      <div className="linkWrapper">
        <p>
          View our source data{' '}
          <a
            href="https://www.kaggle.com/datasets/rtatman/ubuntu-dialogue-corpus/data"
            target="_blank"
            rel="noopener noreferrer"
          >
            Kaggle
          </a>.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
