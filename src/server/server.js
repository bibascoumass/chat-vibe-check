const express = require('express');
const multer = require('multer');
const cors = require('cors');
const Sentiment = require('sentiment');
const fs = require('fs');
const config = require('../config');
const dataManager = require('./dataManager');
const csv = require('csv-parser');
const path = require('path');

const { Readable } = require('stream');

const app = express();
const port = config.serverPort;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());

// on upload, clear the cache and process the new data
app.post('/upload', upload.single('chat'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided.' });
    }
    const updatedMessages = await dataManager.updateDataFromBuffer(req.file.buffer);
    res.json({ messages: updatedMessages });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to process CSV file.' });
  }
});

// return the cached messages from the preloaded or uploaded data.
app.get('/api/plots', (req, res) => {
  try {
    dataManager.updateDataFromBuffer(req.file.buffer);
    const messages = dataManager.getCachedMessages();
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});


// cleanup logic 
const messagesFilePath = path.join(__dirname, 'messages.json');
async function cleanup() {
  try {
    await fsPromises.unlink(messagesFilePath);
    console.log('cleaned up messages.json file.');
  } catch (err) {
    if (err.code !== 'ENOENT') {  // it's fine if file doesn't exist
      console.error('Error cleaning up messages.json:', err);
    }
  }
}
// clear processed messages on exit
process.on('exit', (code) => {
  try {
    if (fs.existsSync(messagesFilePath)) {
      fs.unlinkSync(messagesFilePath);
      console.log('Process exit: messages.json has been deleted.');
    }
  } catch (err) {
    console.error('Process exit: error deleting messages.json', err);
  }
});

['SIGINT', 'SIGTERM', 'SIGUSR2'].forEach((signal) => {
  process.on(signal, async () => {
    console.log(`Received ${signal}, cleaning up...`);
    await cleanup();
    process.exit(0);
  });
});

// preload packaged CSV data on init.
dataManager.preloadData()
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to preload data:', error);
    process.exit(1);
  });
