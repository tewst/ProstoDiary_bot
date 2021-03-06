const AbstractText = require('../models/abstract/abstract-text');
const textService = require('../../services/text.service');
const jsonldAction = require('../models/action/base');
/**
 * @param {object} parameters - object
 * @returns {Promise<jsonldAction>}
 */
module.exports = async (parameters) => {
  const abstractText = new AbstractText({
    ...parameters,
    text: await textService.correctionText(parameters.text),
  });
  await abstractText.prepare();
  return abstractText.context;
};
