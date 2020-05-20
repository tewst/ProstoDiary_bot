// Это публичный API доступный для сторонних ассистентов
for (const api of ['backup', 'help', 'ping', 'insert']) {
  /**
   * @returns {object}
   */
  module.exports[api] = require('./' + api);
}
