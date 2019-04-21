const bot = require('../bot');
/**
 * @param  {Object} chat - chat
 * @returns {Promise<undefined>}
 */
const onPing = async ({ chat }) => {
  const chatId = chat.id;
  await bot.sendMessage(chatId, 'pong');
};

module.exports = onPing;
