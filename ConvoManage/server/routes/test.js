// routes/test.js
const express = require('express');
const router = express.Router();
const sendEmail = require('../utils/sendEmail'); // adjust path if needed

router.post('/test-email', async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    await sendEmail(to, subject, text);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (err) {
    console.error('Error sending test email:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

module.exports = router;
