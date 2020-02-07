const bot = require('../bot');
const pingAction = require('../../../core/functions/ping');
const TelegramBotRequest = require('./telegram-bot-request');

class Ping extends TelegramBotRequest {
  async beginDialog() {
    await super.beginDialog();
    const result = await pingAction({
      auth: {
        user: this.message.passport.user,
        pass: this.message.passport.masterPassword,
      },
    });
    await bot.sendMessage(this.message.chat.id, result.purpose.abstract);
  }
}
/**
 * @param {TelegramMessage} message - message
 * @returns {Promise<undefined>}
 */
module.exports = async (message) => {
  const ping = new Ping(message);
  await ping.beginDialog();
};
