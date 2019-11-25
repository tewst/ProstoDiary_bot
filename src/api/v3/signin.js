const { sql, pool } = require('../../core/database');
const twoFactorAuthService = require('../../services/2fa.service');
/**
 * @description Авторизация и разблокировка чтения/приема и общей работы бота
 * @param {object} requestObject - params
 * @param {string} requestObject.token - two auth generated token
 * @param {?string} requestObject.telegram - telegram id
 * @returns {Promise<string>}
 */
module.exports = async (requestObject) => {
  // email можно брать из запроса через basic auth
  const { telegram = -1, token } = requestObject;
  if (!token) {
    throw new Error('Unknown token argument');
  }

  // 1 - связка (telegram|email) + password
  // 2 - связка (telegram|email) + token
  // todo в зависимости от связки возващается стандартный passport или расширенный
  const signInResult = await pool.connect(async (connection) => {
    try {
      // todo: поддержать `... telegram = ${telegram} OR email = ${email}`
      const passportTable = await connection.one(sql`SELECT
    *
FROM
    passport
WHERE
    telegram = ${telegram}
`);
      const botTable = await connection.one(sql`SELECT
    *
FROM
    bot
WHERE
    passport_id = ${passportTable.id}
`);
      const valid = await twoFactorAuthService.verify(
        botTable.secret_key,
        token,
      );
      if (!valid) {
        // todo делать фолбэк транзакций на инсталляцию делать большой таймаут
        //  ...
        // `Превышено число попыток входа. Начните снова через N секунд
        throw new Error('Неверный ключ. Попробуйте снова');
      }
      if (!botTable.activated) {
        await connection.query(sql`
UPDATE
    bot
SET
    activated = ${true}
WHERE
    passport_id = ${botTable.passport_id}
`);
      }
      return 'Бот активирован';
    } catch (error) {
      return `Вход закончился ошибкой: ${error.message}`;
    }
  });
  return signInResult;
};
