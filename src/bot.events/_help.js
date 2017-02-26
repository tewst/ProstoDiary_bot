const bot = require('./../bot.config.js');
/***
 *
 * @param msg {Object}
 * @return {void}
 */
function onHelp(msg) {
  const data = {
    '/download': 'Загрузка файла с данными (/download)',
    '/dbclear': 'Удаление БД (/dbclear Y/N)',
    '/graph': 'Построение графиков (/graph something)',
    '/get': 'Получение данных за этот срок (/get 01.12.2016)',
    '/set': 'Добавление данных за этот срок (/set 31.01.2016 something)'
  };
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, JSON.stringify(data, null, 2));
}

module.exports = onHelp;
