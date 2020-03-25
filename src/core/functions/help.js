const AbstractCommand = require('../../models/abstract/abstract-command');
/**
 * @description помощь
 * @returns {Promise<Abstract>}
 */
module.exports = async function() {
  const abstractCommand = new AbstractCommand({
    command: 'Help',
  });
  await abstractCommand.prepare();
  return abstractCommand;
};
