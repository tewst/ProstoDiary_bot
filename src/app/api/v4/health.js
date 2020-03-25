const { pool } = require('../../../db/sql');
const bot = require('../../../include/telegram-bot/bot');
const passportQueries = require('../../../db/passport');
const logger = require('../../../lib/log');
/**
 * @description пингуем тем самым проверяем что пользователь активен
 * @param {jsonld} jsonld - jsonld
 * @param {object} passport - passport
 * @returns {Promise<void>}
 */
module.exports = async function(jsonld, { passport }) {
  await pool.connect(async (connection) => {
    try {
      await bot.sendChatAction(passport.telegram_id, 'typing');
    } catch (error) {
      logger.error(error);
      switch (error.response && error.response.statusCode) {
        case 403: {
          await connection.query(
            passportQueries.deactivateByPassportId(passport.id),
          );
          break;
        }
        default: {
          break;
        }
      }
    }
  });
};