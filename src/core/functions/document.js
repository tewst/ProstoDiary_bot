const Abstract = require('../models/abstract');
const jsonldAction = require('../models/action/base');
/**
 * @description обработка документов
 * @param {object} parameters - object
 * @returns {Promise<jsonldAction|Error>}
 */
module.exports = async function (parameters) {
  const AnyAbstract = await Abstract.getAbstractFromDocument(parameters.buffer);
  const anyAbstract = new AnyAbstract(parameters);
  await anyAbstract.prepare();
  return anyAbstract.context;
};
