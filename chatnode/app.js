

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const Sentiment = require('sentiment');
const fs = require('fs');

const app = express();
const port = 8000;
const sentiment = new Sentiment();

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper to clean message text
const cleanMessage = (text) => text.replace(/\s+/g, ' ').trim();

app.post('/upload', upload.single('chat'), async (req, res) => {
    try {
        const chatText = req.file.buffer.toString();
        const lines = chatText.split('\n');
        const parsedMessages = [];

        let prevTimestamp = null;

        for (const line of lines) {
            const match = line.match(
                /^(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}(?:\s?[apAP][mM]))\s*-\s([^:]+):\s(.+)$/
            );

            if (match) {
                const [_, date, time, sender, messageRaw] = match;
                const message = cleanMessage(messageRaw);
                const sentimentScore = sentiment.analyze(message).score;

                const timestamp = new Date(`${date} ${time}`);
                const responseTime = prevTimestamp ? (timestamp - prevTimestamp) / 1000 : 0;
                prevTimestamp = timestamp;

                parsedMessages.push({
                    date,
                    time,
                    sender,
                    message,
                    sentiment: sentimentScore,
                    timestamp,
                    responseTime
                });
            }
        }

        fs.writeFileSync('messages.json', JSON.stringify(parsedMessages, null, 2));

        res.json({ messages: parsedMessages });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to process chat file.' });
    }
});

app.get('/api/heatmap', (req, res) => {
    try {
        const data = fs.readFileSync('messages.json');
        res.json(JSON.parse(data));
    } catch {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
