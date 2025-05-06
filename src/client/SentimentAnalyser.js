import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './assets/App.css';
import './assets/Dashboard.css'

function SentimentAnalyser() {
    const ref = useRef();
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/plots');
                const result = await response.json();

                console.log(result);
                setMessages(result)
            } catch (error) {
                console.error('Error fetching heatmap data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="container">
            <h2>Topic-wise Sentiment Analyser</h2>

            <h2>🧾 Chat Messages & Sentiment</h2>
            <div className="scrollableChatBox">
                <ul className="messageList">
                    {messages.map((msg, idx) => (
                        <li key={idx}>
                            <span className="timestamp">[{msg.date} {msg.time}]</span>
                            <b> {msg.sender}</b>: {msg.message}
                            <span className={`sentiment ${msg.sentiment > 0 ? 'positive' : msg.sentiment < 0 ? 'negative' : 'neutral'}`}>
                                &nbsp;{msg.sentiment > 0 ? '😊' : msg.sentiment < 0 ? '😠' : '😐'} ({msg.sentiment})
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            {/* <button className="closeButton" onClick={() => setShowBackdrop(false)}>Close</button> */}
        </div>
    );
}

export default SentimentAnalyser;
