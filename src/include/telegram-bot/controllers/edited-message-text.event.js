const editAction = require('../../../core/functions/edit');
const deleteAction = require('../../../core/functions/remove');
const TelegramBotRequest = require('./telegram-bot-request');
const TelegramMessage = require('../models/telegram-bot-message');

class EditMessageText extends TelegramBotRequest {
  /**
   * @constant
   * @type {string[]}
   */
  static get DELETE_VARIABLES() {
    return ['del', 'remove'];
  }
  async beginDialog(silent) {
    await super.beginDialog(silent);
    if (this.message.text.startsWith('/')) {
      await this.bot.sendMessage(
        this.message.chat.id,
        'Редактирование этой записи невозможно',
      );
      return;
    }
    // fixme
    // if (!isExist) {
    // TODO: если записи нет - тогда спрашиваем пользователя, создавать ли новую запись?
    // await bot.sendMessage(this.message.chat.id, 'Запись не найдена');
    // return;
    // }
    // todo перенести это в telegram-bot-message.js с новым типом delete-text
    // Сообщение удалено?
    if (
      EditMessageText.DELETE_VARIABLES.some((del) => {
        return this.message.text.toLowerCase() === del.toLowerCase();
      })
    ) {
      const jsonldRequest = await deleteAction({
        telegram: this.chatData,
        creator: this.creator,
        publisher: this.publisher,
        silent,
      });
      await this.rpc(jsonldRequest);
    } else {
      // TODO: https://github.com/gotois/ProstoDiary_bot/issues/34
      const result = await editAction({
        telegram: this.chatData,
        creator: this.creator,
        publisher: this.publisher,
        silent,
      });
      await this.rpc(result);
    }
  }
}
/**
 * @description Обновление текста в БД
 * @param {TelegramMessage} message - msg
 * @param {boolean} silent - silent dialog
 * @returns {Promise<undefined>}
 */
module.exports = async (message, silent) => {
  message.text = message.text.trim();
  const editedMessageTextAPI = new EditMessageText(message);
  await editedMessageTextAPI.beginDialog(silent);
};
