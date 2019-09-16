const bot = require('../core');
const logger = require('../services/logger.service');
/**
 * /count - -> выведет сколько всего потрачено
 * /count + -> выведет сколько всего получено
 *
 * @param {object} msg - message
 * @param {object} msg.chat - chat
 * @param {object} msg.from - from
 * @param {Array} match - mather
 * @returns {undefined}
 */
const onCount = async ({ chat, from }, match) => {
  logger.log('info', onCount.name);
  const chatId = chat.id;
  const fromId = from.id;
  const params = {
    parse_mode: 'Markdown',
  };
  const countAPI = require('../api/v1/count');
  if (match[1]) {
    try {
      const countResult = await countAPI(match[1].toUpperCase(), fromId);
      await bot.sendMessage(chatId, countResult, params);
    } catch (error) {
      await bot.sendMessage(chatId, error.message);
      logger.error(error);
    }
  } else {
    const replyParams = Object.assign({}, params, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Всего потрачено', callback_data: '-' },
            { text: 'Всего получено', callback_data: '+' },
          ],
        ],
      },
    });
    await bot.sendMessage(chatId, 'Финансы', replyParams);
    // TODO: возможна утечка, если не уничтожать слушатель
    bot.once('callback_query', async ({ data }) => {
      const countResult = await countAPI(data, fromId);
      await bot.sendMessage(chatId, countResult, params);
    });
  }
};

module.exports = onCount;
