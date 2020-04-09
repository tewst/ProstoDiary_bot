const { sql } = require('../sql');

module.exports = {
  selectRoleByEmail(email) {
    return sql`
        SELECT role FROM client.roles WHERE email = ${email}
    `;
  },
  /**
   * @param {string} login - user email or telegram id
   * @param {string} password - bot master password
   * @returns {*}
   */
  checkByEmailAndMasterPassword(login, password) {
    return sql`SELECT 1 FROM client.passport AS passportUser, client.bot AS passportBot
WHERE (passportUser.email = ${login} OR passportUser.telegram_id = ${login})
AND
passportBot.master_password = crypt(${password}, master_password)
`;
  },
  /**
   * @param {string} login - botEmail
   * @param {string} password - MasterPassword
   * @returns {*}
   */
  getPassport(login, password) {
    return sql`SELECT
    *
FROM
    client.bot
WHERE
    email = ${login} OR email = ${login + '@gotointeractive.com'}
    AND master_password = crypt(${password}, master_password)
`;
  },
  activateByPassportId(passportId) {
    return sql`
UPDATE
    client.bot
SET
    activated = ${true}
WHERE
    passport_id = ${passportId}
`;
  },
  deactivateByPassportId(passportId) {
    return sql`
UPDATE
    client.bot
SET
    activated = ${false}
WHERE
    passport_id = ${passportId}
`;
  },
  /**
   * @todo rename select by user email or telegram id
   * @param {string} login - telegram user id or user email
   * @returns {*}
   */
  selectUserByEmail(login) {
    return sql`
      SELECT * FROM client.passport WHERE email = ${login} OR telegram_id = ${login}
    `;
  },
  selectBotByEmail(email) {
    return sql`
      SELECT * FROM client.bot WHERE email = ${email} AND activated = true
    `;
  },
  selectBotById(id) {
    return sql`SELECT
    *
FROM
    client.bot
WHERE
    id = ${id}
`;
  },
  selectByPassport(passportId) {
    return sql`SELECT
    *
FROM
    client.bot
WHERE
    passport_id = ${passportId}
`;
  },
  /**
   * @param {object} obj - bot object
   * @param {uid} obj.passportId - passport ID
   * @param {string} obj.email - email
   * @param {uid} obj.emailUID - email id
   * @param {string} obj.emailPassword - email password
   * @param {string} obj.masterPassword - master password
   * @param {string} obj.secretKey - secret key
   * @param {buffer} obj.publicKeyCert - public key pem
   * @param {buffer} obj.privateKeyCert - private key pem
   * @returns {*}
   */
  createBot({
    passportId,
    email,
    emailUID,
    emailPassword,
    secretKey,
    masterPassword,
    publicKeyCert,
    privateKeyCert,
  }) {
    return sql`
INSERT INTO client.bot
    (passport_id, email, email_uid, email_password, secret_key, master_password, public_key_cert, private_key_cert)
VALUES
    (
    ${passportId},
    ${email},
    ${emailUID},
    ${emailPassword},
    ${secretKey},
    crypt(${masterPassword}, gen_salt('bf', 8)),
    ${sql.binary(publicKeyCert)},
    ${sql.binary(privateKeyCert)}
    )
`;
  },
  getPassports() {
    return sql`SELECT
    *
FROM
    client.passport
`;
  },
  selectAll(telegram_id, yandex_id = null, facebook_id = null) {
    return sql`
SELECT *
    FROM
client.passport
    WHERE
telegram_id = ${telegram_id} OR
yandex_id = ${yandex_id} OR
facebook_id = ${facebook_id}
`;
  },
  updateTelegramPassportByPassportId(telegram, passportUID) {
    return sql`
UPDATE
    client.passport
SET
    telegram_id = ${telegram.from.id},
    telegram_passport = ${sql.json(telegram.from)}
WHERE
    id = ${passportUID}
`;
  },
  updateYandexPassportByPassportId(passport, session, passportUID) {
    return sql`
UPDATE
    client.passport
SET
    yandex_id = ${passport.client_id},
    yandex_passport = ${sql.json(passport)},
    yandex_session = ${sql.json(session)}
WHERE
    id = ${passportUID}
`;
  },
  updateFacebookPassportByPassportId(passport, session, passportUID) {
    return sql`
UPDATE
    client.passport
SET
    facebook_id = ${passport.id},
    facebook_passport = ${sql.json(passport)},
    facebook_session = ${sql.json(session)}
WHERE
    id = ${passportUID}
`;
  },
  createPassport({
    email,
    phone,
    telegramPassport,
    facebookPassport,
    yandexPassport,
    facebookSession,
    yandexSession,
  }) {
    return sql`
INSERT INTO client.passport (
    email,
    phone,
    telegram_id,
    telegram_passport,
    facebook_id,
    facebook_passport,
    facebook_session,
    yandex_id,
    yandex_passport,
    yandex_session
)
VALUES (
    ${email},
    ${phone},
    ${telegramPassport ? telegramPassport.id : null},
    ${telegramPassport ? sql.json(telegramPassport) : null},
    ${facebookPassport ? facebookPassport.id : null},
    ${facebookPassport ? sql.json(facebookPassport) : null},
    ${facebookPassport ? sql.json(facebookSession) : null},
    ${yandexPassport ? yandexPassport.client_id : null},
    ${yandexPassport ? sql.json(yandexPassport) : null},
    ${yandexPassport ? sql.json(yandexSession) : null}
)
RETURNING
    id, email, phone
`;
  },
};