const axios = require('axios');

/**
 * Send a message via Telegram Bot API.
 * @param {string} message - The message to send.
 */
const sendTelegramMessage = async (message) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn('Telegram Bot Token or Chat ID not configured in .env');
    return;
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    });
  } catch (err) {
    console.error('Telegram Notification Error:', err.response?.data || err.message);
  }
};

module.exports = { sendTelegramMessage };
