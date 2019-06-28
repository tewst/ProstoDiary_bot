// const nlp = require('compromise');
const bot = require('../bot');
const sessions = require('../services/session.service');
const crypt = require('../services/crypt.service');
const format = require('../services/format.service');
const commands = require('../commands');
const dbEntries = require('../database/entities.database');
const logger = require('../services/logger.service');
const { inputAnalyze } = require('../services/intent.service');
const { spellText } = require('../services/speller.service');
/**
 * Все что пишешь - записывается в сегодняшний день
 *
 * @param {object} msg - message
 * @param {object} msg.chat - chat
 * @param {object} msg.from - from
 * @param {string} msg.text - text
 * @param {object} msg.reply_to_message - message
 * @param {number} msg.message_id - id message
 * @param {Date} msg.date -date message
 * @returns {undefined}
 */
const onText = async ({
  chat,
  from,
  text,
  reply_to_message,
  message_id,
  date,
}) => {
  logger.log('info', onText.name);
  const chatId = chat.id;
  const fromId = from.id;
  const input = text.trim();
  // Пропускаем Reply сообщений
  if (reply_to_message instanceof Object) {
    return;
  }
  // Пропускаем зарезервированные команды
  for (const command of Object.keys(commands)) {
    if (input.search(commands[command]) >= 0) {
      return;
    }
  }
  if (input.startsWith('/')) {
    await bot.sendMessage(chatId, 'Command not found. Text /help for help');
    return;
  }
  // TODO: пример получения имен https://github.com/gotois/ProstoDiary_bot/issues/83
  // пока работает только с английскими именами
  // let xxx = nlp(input)
  //   .people()
  //   .data();
  // console.log('topk', xxx);
  const currentUser = sessions.getSession(fromId);
  try {
    // TODO: обернуть весь pipe работы с input в отдельный сервис, где расписать подробно весь процесс
    // ...
    const spelledText = await spellText(input);
    const intentMessage = await inputAnalyze(spelledText);

    if (intentMessage.length > 0) {
      await bot.sendMessage(chatId, intentMessage);
    }
  } catch (error) {
    logger.log('error', error.toString());
  }
  // todo: https://github.com/gotois/ProstoDiary_bot/issues/98
  try {
    await dbEntries.post(
      currentUser.id,
      crypt.encode(input),
      message_id,
      new Date(date * 1000),
    );
    const okText = format.previousInput(input);
    await bot.sendMessage(chatId, okText, {
      disable_notification: true,
      disable_web_page_preview: true,
    });
  } catch (error) {
    logger.log('error', error.toString());
    await bot.sendMessage(chatId, error.toString());
  }
};

module.exports = onText;
