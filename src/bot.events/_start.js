const sessions = require('./../sessions');
const bot = require('./../bot.config.js');
const dbUsers = require('./../database/database.users.js');
/***
 * При первом включении создаем в БД специальную колонку для работы
 * @param msg {Object}
 * @return {void}
 */
function onStart(msg) {
  const chatId = msg.chat.id;
  const fromId = msg.from.id;
  const currentUser = sessions.getSession(fromId);
  dbUsers.check(currentUser.id).then(value => {
    if (value.rowCount === 0) {
      return dbUsers.post(currentUser.id).then(() => {
        return bot.sendMessage(chatId, 'Вы вошли в систему');
      });
    } else {
      return bot.sendMessage(chatId, 'Повторный вход не требуется');
    }
  }).catch(error => {
    console.error(error);
    return bot.sendMessage(chatId, 'Операция не выполнена');
  });
}

module.exports = onStart;
