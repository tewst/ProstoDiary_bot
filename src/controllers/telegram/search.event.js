const bot = require('../../core/bot');
const commands = require('../core/commands');
const logger = require('../../services/logger.service');
const dialogflowService = require('../../services/dialogflow.service');
const TelegramBotRequest = require('./telegram-bot-request');

class Search extends TelegramBotRequest {
  /**
   * @constant
   * @type {object}
   */
  static get enum() {
    return {
      NEXT_PAGE: '__next_page',
    };
  }

  constructor(message, session) {
    message.text = message.text
      .replace(commands.SEARCH.alias, '')
      .trim()
      .toLowerCase();
    super(message, session);

    this.messageListener = this.messageListener.bind(this);
    bot.on('callback_query', this.messageListener);
  }

  async beginDialog() {
    await super.beginDialog();
    const dialogResult = await dialogflowService.detectTextIntent(
      '{search} ' + this.message.text,
    );
    if (dialogResult.intent.displayName !== 'SearchIntent') {
      // todo: логировать такой варнинг - чтобы знать что ищу
      await bot.sendMessage(this.message.chat.id, 'Unknown Search');
      return;
    }
    await bot.sendMessage(this.message.chat.id, `Поиск ${this.message.text}`, {
      reply_markup: {
        force_reply: true,
        inline_keyboard: [
          [
            { text: 'Все записи ASC', callback_data: 'ASC' },
            { text: 'Все записи DESC', callback_data: 'DESC' },
          ],
          [
            { text: 'Расходы', callback_data: 'COUNT -' },
            { text: 'Доходы', callback_data: 'COUNT +' },
          ],
          [{ text: 'Введите дополняющий текст', callback_data: 'DETAIL' }],
        ],
      },
    });
  }
  async showMessageByOne() {
    const generatorResult = this._searchGenerator.next();
    if (generatorResult.done || !generatorResult.value) {
      return;
    }
    let replyMarkup;
    if (generatorResult.done) {
      replyMarkup = null;
    } else {
      replyMarkup = {
        inline_keyboard: [
          [{ text: 'NEXT', callback_data: Search.enum.NEXT_PAGE }],
        ],
      };
    }
    // fixme: форвардить сообщения, если они есть
    //  if (false) {
    //  await bot.forwardMessage(chatId, userId, row.telegram_message_id);
    //  } else
    {
      this.botMessage = await bot.sendMessage(
        this.message.chat.id,
        generatorResult.value,
        {
          disable_web_page_preview: true,
          parse_mode: 'Markdown',
          reply_markup: replyMarkup,
        },
      );
    }
  }
  async messageListener({ data }) {
    switch (data) {
      case Search.enum.NEXT_PAGE: {
        await bot.deleteMessage(
          this.message.chat.id,
          this.botMessage.message_id,
        );
        await this.showMessageByOne();
        break;
      }
      // Показ всех записей сортировка ASC
      case 'ASC': {
        const searchResult = await this.request('search', {});

        // todo использовать этот контроллер для понимания что отображать пользователю - если есть возможность отобразить график - отображать и прочее
        if (searchResult.graph) {
          // await bot.sendPhoto(
          //   message.chat.id,
          //   searchResult.graph.buffer,
          //   searchResult.graph.options,
          // );
        }
        if (searchResult.generator) {
          this._searchGenerator = searchResult.generator;
          await this.showMessageByOne();
        }
        break;
      }
      // Показ всех записей сортировка DESC
      case 'DESC': {
        const searchResult = await this.request('search', {});
        break;
      }
      // детальный поиск через follow-up intent
      case 'DETAIL': {
        const botMessageMore = await bot.sendMessage(
          this.message.chat.id,
          'Детальный поиск [SEARCH]',
          {
            reply_markup: {
              force_reply: true,
            },
          },
        );
        bot.onReplyToMessage(
          this.message.chat.id,
          botMessageMore.message_id,
          async ({ text }) => {
            const dialogResult = await dialogflowService.detectTextIntent(text);
            logger.log(':::', dialogResult);
            await bot.sendMessage(
              this.message.chat.id,
              dialogResult.fulfillmentText,
            );
          },
        );
        break;
      }
      default: {
        bot.off('callback_query', this.messageListener);
        break;
      }
    }
  }
}
/**
 * @param {TelegramMessage} message - message
 * @returns {Promise<undefined>}
 */
module.exports = async (message, session) => {
  const search = new Search(message, session);
  await search.beginDialog();
};