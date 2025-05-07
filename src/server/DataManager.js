"use strict";

const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const csv = require('csv-parser');
const { Readable } = require('stream');
const Sentiment = require('sentiment');

const sentiment = new Sentiment();

// update data dir path here
const dataDir = path.join('Data');
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
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
}


async function preloadData() {
  try {
    const files = await fsPromises.readdir(dataDir);
    const csvFiles = files.filter(file => file.toLowerCase().endsWith('.csv'));

    let allRows = [];

    for (const file of csvFiles) {
      const filePath = path.join(dataDir, file);
      // set conversation ID from file name - todo change to something more descriptive
      const conversationId = path.basename(file, path.extname(file));
      console.log(`Loading CSV file: ${filePath} as conversation "${conversationId}"`);
      
      const fileRows = await new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (row) => {
            row.conversation = conversationId;
            results.push(row);
          })
          .on('end', () => resolve(results))
          .on('error', (err) => reject(err));
      });
      allRows = allRows.concat(fileRows);
    }

    // sorting after load
    allRows.sort((a, b) => new Date(a.date) - new Date(b.date));

    const parsedMessages = [];
    let prevTimestamp = null;
    for (const row of allRows) {
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
        responseTime,
        conversation: row.conversation
      });
    }

    cachedMessages = parsedMessages;
    await fsPromises.writeFile(messagesFilePath, JSON.stringify(cachedMessages, null, 2), 'utf8');
    console.log(`Preloaded ${csvFiles.length} CSV file(s) with a total of ${cachedMessages.length} messages.`);
    return cachedMessages;
  } catch (error) {
    console.error("Error preloading CSV files:", error);
    throw error;
  }
}

async function updateDataFromBuffer(buffer) {
  if (cachedMessages.length === 0) { 
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
