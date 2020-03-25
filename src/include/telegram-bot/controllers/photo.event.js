const bot = require('../bot');
const { getTelegramFile } = require('../../../services/file.service');
const TelegramBotRequest = require('./telegram-bot-request');
const photoAction = require('../../../core/functions/photo');
const { rpc } = require('../../../services/request.service');

class Photo extends TelegramBotRequest {
  constructor(message) {
    super(message);
    this.method = 'insert';
  }
  async beginDialog(silent) {
    await super.beginDialog();
    const [_smallPhoto, mediumPhoto] = this.message.photo;
    if (!mediumPhoto.file_id || mediumPhoto.file_size === 0) {
      if (!silent) {
        await bot.sendMessage(this.message.chat.id, 'Wrong photo');
      }
      return;
    }
    if (!silent) {
      await bot.sendChatAction(this.message.chat.id, 'typing');
    }
    const imageBuffer = await getTelegramFile(mediumPhoto.file_id);
    const result = await photoAction({
      imageBuffer,
      caption: this.message.caption,
      date: this.message.date,
      hashtags: this.hashtags,
      telegram_message_id: this.message.message_id,
    });
    const jsonldMessage = await rpc({
      body: {
        jsonrpc: '2.0',
        method: this.method,
        id: 1,
        params: result.context,
      },
      jwt: this.message.passport.jwt,
    });
    if (!silent) {
      await bot.sendMessage(
        this.message.chat.id,
        jsonldMessage.purpose.abstract,
        {
          parse_mode: 'Markdown',
        },
      );
    }
  }
}
/**
 * @param {TelegramMessage} message - message
 * @param {boolean} silent - silent dialog
 * @returns {Promise<undefined>}
 */
module.exports = async (message, silent) => {
  const photo = new Photo(message);
  await photo.beginDialog(silent);
};
