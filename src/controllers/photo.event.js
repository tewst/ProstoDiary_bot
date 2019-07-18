const bot = require('../bot');
const logger = require('../services/logger.service');
const photoAPI = require('../api/v1/photo');
/**
 * @param {object} msg - message
 * @param {object} msg.chat - chat
 * @param {Array<object>} msg.photo - photo
 * @param {string} msg.caption - caption
 * @returns {Promise<undefined>}
 */
const onPhoto = async ({ chat, photo, caption }) => {
  logger.log('info', onPhoto.name);
  const chatId = chat.id;
  const [_, mediumPhoto] = photo;
  if (!mediumPhoto.file_id) {
    throw new Error('Wrong file');
  }
  try {
    const photoResult = await photoAPI(mediumPhoto, caption);
    await bot.sendMessage(chatId, photoResult, {
      parse_mode: 'Markdown',
    });
  } catch (error) {
    logger.log('error', error.toString());
    await bot.sendMessage(chatId, error.toString());
  }
};

module.exports = onPhoto;