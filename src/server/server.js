const express = require('express');
const multer = require('multer');
const cors = require('cors');
const Sentiment = require('sentiment');
const fs = require('fs');

const csv = require('csv-parser');

const { Readable } = require('stream');
const config = require('../config');

const app = express();
const port = config.serverPort;
const sentiment = new Sentiment();

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

function bufferToStream(buffer) {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
}

app.post('/upload', upload.single('chat'), async (req, res) => {
    try {
        const buffer = req.file.buffer;
        const results = [];

        const stream = bufferToStream(buffer);

        stream.pipe(csv())
            .on('data', (row) => {
                results.push(row);
            })
            .on('end', () => {
                // Sort by ascending timestamp
                results.sort((a, b) => new Date(a.date) - new Date(b.date));

                const parsedMessages = [];
                let prevTimestamp = null;

                for (const row of results) {
                    const timestamp = new Date(row.date);
                    const date = timestamp.toLocaleDateString(); 
                    const time = timestamp.toLocaleTimeString(); 

                    const sender = row.from;
                    const message = row.text;
                    const sentimentScore = sentiment.analyze(message).score;

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

                fs.writeFileSync('messages.json', JSON.stringify(parsedMessages, null, 2));
                res.json({ messages: parsedMessages });
            });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to process CSV file.' });
    }
});

app.get('/api/plots', (req, res) => {
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
