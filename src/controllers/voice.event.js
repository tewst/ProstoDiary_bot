const bot = require('../bot');
const logger = require('../services/logger.service');
const voiceAPI = require('../api/v1/voice');
/**
 * @function
 * @param {object} msg - msg
 * @param {object} msg.chat - chat
 * @param {object} msg.voice - voice
 * @returns {Promise<undefined>}
 */
const getVoice = async ({ chat, voice }) => {
  logger.log('info', getVoice.name);
  const chatId = chat.id;
  try {
    const voiceResult = await voiceAPI(voice);
    await bot.sendMessage(chatId, voiceResult);
  } catch (error) {
    logger.log('error', error.toString());
    await bot.sendMessage(chatId, 'Распознавание голоса неудачно');
  }
};

module.exports = getVoice;