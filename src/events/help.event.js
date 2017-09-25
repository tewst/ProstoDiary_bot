const bot = require('./../config/bot.config.js');
/***
 *
 * @param msg {Object}
 * @param msg.chat {Object}
 * @return {void}
 */
const onHelp = async ({chat}) => {
  const data = {
    '/download': 'Загрузка файла с данными (/download)',
    '/dbclear': 'Удаление БД (/dbclear Y/N)',
    '/graph': 'Построение графиков (/graph String|RegExp)',
    '/get': 'Получение данных за этот срок (/get 01.12.2016)',
    '/set': 'Добавление данных за этот срок (/set 31.01.2016 something)',
    '/count': 'Подсчет потраченого (/count -) и полученного (/count +)',
  };
  const chatId = chat.id;
  await bot.sendMessage(chatId, JSON.stringify(data, null, 2));
};

module.exports = onHelp;
