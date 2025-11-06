require('dotenv').config();
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
const port = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// --- Multer memory storage (no disk) ---
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.static('public'));

// --- Upload endpoint ---
app.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    const buffer = req.file.buffer;

    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('photo', buffer, { filename: 'snapshot.png' });

    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;

    const response = await axios.post(telegramUrl, formData, {
      headers: formData.getHeaders()
    });

    console.log('📬 Telegram response:', response.data);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Telegram error:', err.response?.data || err.message);
    res.status(500).json({ success: false });
  }
});

// --- Start server ---
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});