// import React, { useEffect, useRef, useState } from 'react';
// import * as d3 from 'd3';
// import './App.css';
// import './Dashboard.css'

// function SentimentAnalyser() {
//     const ref = useRef();
//     const [messages, setMessages] = useState([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await fetch('http://localhost:5001/api/plots');
//                 const result = await response.json();

//                 console.log(result);
//                 setMessages(result)
//             } catch (error) {
//                 console.error('Error fetching heatmap data:', error);
//             }
//         };

//         fetchData();
//     }, []);

//     return (
//         <div className="container">
//             <h2>Topic-wise Sentiment Analyser</h2>

//             <h2>🧾 Chat Messages & Sentiment</h2>
//             <div className="scrollableChatBox">
//                 <ul className="messageList">
//                     {messages.map((msg, idx) => (
//                         <li key={idx}>
//                             <span className="timestamp">[{msg.date} {msg.time}]</span>
//                             <b> {msg.sender}</b>: {msg.message}
//                             <span className={`sentiment ${msg.sentiment > 0 ? 'positive' : msg.sentiment < 0 ? 'negative' : 'neutral'}`}>
//                                 &nbsp;{msg.sentiment > 0 ? '😊' : msg.sentiment < 0 ? '😠' : '😐'} ({msg.sentiment})
//                             </span>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//             {/* <button className="closeButton" onClick={() => setShowBackdrop(false)}>Close</button> */}
//         </div>
//     );
// }

// export default SentimentAnalyser;



import React, { useEffect, useState } from 'react';
import './assets/App.css';
import './assets/Dashboard.css'
import config from '../config';

function SentimentAnalyser() {
    const [messages, setMessages] = useState([]);
    const [longestConversation, setLongestConversation] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [charLimit, setCharLimit] = useState(30); // Default limit of 30 characters

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(process.env.PUBLIC_URL+ '/messages.json');
                const result = await response.json();
                setMessages(result);
                findLongestConversation(result);
                setCharLimit(calculateAverageMessageLength(result)); // Set the character limit based on message data
            } catch (error) {
                console.error('Error fetching heatmap data:', error);
            }
        };

        fetchData();
    }, []);

    const calculateAverageMessageLength = (messages) => {
        const totalLength = messages.reduce((acc, msg) => acc + msg.message.length, 0);
        return Math.floor(totalLength / messages.length);
    };

    const findLongestConversation = (messages) => {
        const conversationMap = {};
        messages.forEach((msg) => {
            const participants = [msg.sender, msg.receiver].sort().join('-');
            if (!conversationMap[participants]) {
                conversationMap[participants] = [];
            }
            conversationMap[participants].push(msg);
        });

        let longest = null;
        let maxMessages = 0;

        for (let participants in conversationMap) {
            const conversation = conversationMap[participants];
            if (conversation.length > maxMessages) {
                longest = conversation;
                maxMessages = conversation.length;
            }
        }

        setLongestConversation(longest);
    };

    return (
        <div className="container">
            <h2>Topic-wise Sentiment Analyser</h2>

            <h2>🧾 Chat Messages & Sentiment</h2>
            {longestConversation && (
                <button className="showButton" onClick={() => setShowModal(true)}>
                    Show Longest Conversation
                </button>
            )}
            <p></p>
            <div className="scrollableChatBox">
                <ul className="messageList">
                    {messages.map((msg, idx) => (
                        <li key={idx}>
                            <span className="timestamp">[{msg.date} {msg.time}]</span>
                            <b> {msg.sender}</b>: 
                            <span 
                                title={msg.message} // Show full message on hover
                                className="messageContent"
                            >
                                {msg.message.length > charLimit ? `${msg.message.slice(0, charLimit)}...` : msg.message}
                            </span>
                            <span
                                className={`sentiment ${msg.sentiment > 0 ? 'positive' : msg.sentiment < 0 ? 'negative' : 'neutral'}`}
                            >
                                &nbsp;{msg.sentiment > 0 ? '😊' : msg.sentiment < 0 ? '😠' : '😐'} ({msg.sentiment})
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Modal for Longest Conversation */}
            {showModal && (
                <>
                    <div className="backdrop" onClick={() => setShowModal(false)} />
                    <div className="modal">
                        <div className="modalHeader">
                            <h3>Longest Conversation</h3>
                            <button className="closeButton" onClick={() => setShowModal(false)}>✖</button>
                        </div>
                        <p><b>From:</b> {longestConversation[0].sender}</p>
                        <p><b>To:</b> {longestConversation[0].receiver}</p>
                        <p><b>Total Messages:</b> {longestConversation.length}</p>
                        <div className="modalContent">
                            <ul>
                                {longestConversation.map((msg, idx) => (
                                    <li key={idx}>
                                        <b>{msg.sender}</b>: 
                                        <span 
                                            title={msg.message} // Show full message on hover
                                            className="messageContent"
                                        >
                                            {msg.message.length > charLimit ? `${msg.message.slice(0, charLimit)}...` : msg.message}
                                        </span>
                                        <span className={`sentiment ${msg.sentiment > 0 ? 'positive' : msg.sentiment < 0 ? 'negative' : 'neutral'}`}>
                                            &nbsp;{msg.sentiment > 0 ? '😊' : msg.sentiment < 0 ? '😠' : '😐'} ({msg.sentiment})
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default SentimentAnalyser;
