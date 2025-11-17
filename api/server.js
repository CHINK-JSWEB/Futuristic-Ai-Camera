require('dotenv').config();
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

// IMPORTANT: Vercel requires memory storage (no disk writing)
const upload = multer({ storage: multer.memoryStorage() });

const app = express();
app.use(express.json());

// Environment variables
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// ---- UPLOAD PHOTO (Buffer, not file system) ----
app.post('/upload', upload.single('photo'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }

  console.log("📸 Photo received (memory buffer)");

  const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;

  try {
    const form = new FormData();
    form.append('chat_id', CHAT_ID);
    form.append('photo', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await axios.post(telegramUrl, form, {
      headers: form.getHeaders(),
    });

    console.log("📬 Telegram response:", response.data);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Telegram error:", err.response?.data || err.message);
    res.status(500).json({ success: false });
  }
});

// ---- UPLOAD TEXT ----
app.post('/upload-text', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ success: false, error: "No text provided" });
  }

  const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    const response = await axios.post(telegramUrl, {
      chat_id: CHAT_ID,
      text: text,
      parse_mode: 'HTML'
    });

    console.log("📬 Telegram message sent:", response.data);

    res.json({ success: true });
  } catch (error) {
    console.error("❌ Telegram error:", error.response?.data || error.message);
    res.status(500).json({ success: false });
  }
});

// ---- VERCEL SERVERLESS EXPORT ----
module.exports = (req, res) => {
  app(req, res);
};