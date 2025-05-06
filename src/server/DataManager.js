const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const csv = require('csv-parser');
const { Readable } = require('stream');
const Sentiment = require('sentiment');

const sentiment = new Sentiment();


// UPDATE INPUT FILE HERE
const preloadedFilePath = path.join('Data/1k-sample.csv');
const messagesFilePath = path.join('messages.json');

let cachedMessages = [];

function bufferToStream(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

function loadCSVFromStream(stream) {
  return new Promise((resolve, reject) => {
    const results = [];
    stream
      .pipe(csv())
      .on('data', (row) => results.push(row))
      .on('end', () => {
        // Sort rows by ascending timestamp.
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
        resolve(parsedMessages);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

async function preloadData() {
  return new Promise((resolve, reject) => {
    const results = [];
    const stream = fs.createReadStream(preloadedFilePath);

    stream
      .pipe(csv())
      .on('data', (row) => results.push(row))
      .on('end', async () => {
        try {
          // Sort rows by ascending timestamp.
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
          cachedMessages = parsedMessages;
          // asynch write
          await fsPromises.writeFile(messagesFilePath, JSON.stringify(cachedMessages, null, 2), 'utf8');
          resolve(cachedMessages);
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

//  On upload, process the incoming CSV file buffer. Clear cached data and overwrite it.
async function updateDataFromBuffer(buffer) {
    if (cachedMessages.length === 0 ) {
        const stream = bufferToStream(buffer);
        const parsedMessages = await loadCSVFromStream(stream);
        cachedMessages = parsedMessages;
    }
  
  await fsPromises.writeFile(messagesFilePath, JSON.stringify(cachedMessages, null, 2), 'utf8');
  return cachedMessages;
}

function getCachedMessages() {
  return cachedMessages;
}

module.exports = {
  preloadData,
  updateDataFromBuffer,
  getCachedMessages
};
