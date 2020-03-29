const crypto = require('crypto');
const bot = require('../bot');
const logger = require('../../../lib/log');
const { IS_AVA_OR_CI, IS_AVA } = require('../../../environment');
const { rpc, get } = require('../../../services/request.service');

class TelegramBotRequest {
  #message;
  /**
   * @param {TelegramMessage} message - message
   */
  constructor(message) {
    this.bot = bot;
    this.#message = message;
    this.userHash = crypto.createHash('md5').update(String(message.from.id)).digest("hex");
  }
  get message() {
    return this.#message;
  }
  /**
   * @returns {Array<string>}
   */
  get hashtags() {
    const hashtags = new Set();
    if (Array.isArray(this.message.entities)) {
      this.message.entities
        .filter((entity) => {
          return entity.type === 'hashtag';
        })
        .forEach((entity) => {
          // eslint-disable-next-line unicorn/prefer-string-slice
          const hashtag = this.message.text.substr(
            entity.offset + 1,
            entity.length - 1,
          );
          hashtags.add(hashtag);
        });
    }
    return [...hashtags];
  }
  async beginDialog(silent) {
    const instanceProto = Object.getPrototypeOf(this);
    logger.info('telegram: ' + instanceProto.constructor.name);
    if (!silent && !IS_AVA_OR_CI) {
      await this.bot.sendChatAction(this.message.chat.id, 'typing');
    }
  }
  /**
   * @param {string} fileId - file id
   * @returns {Promise<Buffer>}
   */
  async getTelegramFile(fileId) {
    /**
     * @type {string}
     */
    const TELEGRAM_HOST = 'api.telegram.org';
    const fileInfo = await bot.getFile(fileId);
    const buffer = await get(
      `https://${TELEGRAM_HOST}/file/bot${bot.token}/${fileInfo.file_path}`,
    );
    return buffer;
  }
  /**
   * @param {Action} action - action
   * @returns {Promise<*>}
   */
  async rpc(action) {
    const jsonldMessage = await rpc({
      body: {
        jsonrpc: '2.0',
        method: this.method,
        id: 1,
        params: action.context,
      },
      jwt: this.message.passport.jwt,
    });
    // hack специальный вызов для тестирования E2E. Без явного ответа sendMessage возникает ошибка SubError
    if (IS_AVA) {
      await this.bot.sendMessage(this.message.chat.id, jsonldMessage.purpose.abstract);
    }
    return jsonldMessage;
  }
}

module.exports = TelegramBotRequest;
