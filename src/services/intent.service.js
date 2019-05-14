const dialogflow = require('dialogflow');
const { getDialogFlowLangCodeFromQuery } = require('./detect-language.service');
const { formatQuery } = require('./text.service');
const { DIALOGFLOW } = require('../env');
// const language = require('../services/language.service');

const sessionClient = new dialogflow.SessionsClient({
  credentials: DIALOGFLOW.DIALOGFLOW_CREDENTIALS,
});

/**
 * @constant
 * @type {string}
 */
const DIALOGFLOW_INTENT_URL = 'projects/prostodiary/agent/intents/';
/**
 * @readonly
 * @type {Object}
 */
const INTENTS = {
  BUY: DIALOGFLOW_INTENT_URL + '41e519b4-c864-4fe6-9096-1282259c8c91',
  EAT: DIALOGFLOW_INTENT_URL + '26742785-da19-41b6-9c04-676f3bccf175',
  FINANCE: DIALOGFLOW_INTENT_URL + '41e519b4-c864-4fe6-9096-1282259c8c91',
  FITNESS: DIALOGFLOW_INTENT_URL + '7a583272-ded8-4f0e-a609-23bcd2589542',
  HEALTH: DIALOGFLOW_INTENT_URL + 'ba3c1ba9-dd32-444f-93c8-deced4e877c8',
  WEIGHT: DIALOGFLOW_INTENT_URL + 'dfa31d31-274a-4a57-8436-22ad6cf14d8c',
  WORK: DIALOGFLOW_INTENT_URL + '5a82fc33-7a6e-4b97-89c2-b8e2a32ea0ad',
};
/**
 * Send request and log result
 *
 * @param {string} query - query
 * @returns {Promise<Array>}
 */
const detectTextIntent = async (query) => {
  const sessionId = 'quickstart-session-id'; // TODO: into env и почему такое значение?
  const languageCode = getDialogFlowLangCodeFromQuery(query);
  const sessionPath = sessionClient.sessionPath(
    DIALOGFLOW.DIALOGFLOW_PROJECT_ID,
    sessionId,
  );
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode: languageCode,
      },
    },
  };
  const res = await sessionClient.detectIntent(request);
  return res;
};
/**
 * TODO: получаю имя и значение Intent
 * TODO: нужно покрыть тестами
 * на основе этого делаю записи в нужные части БД (сохраняя при этом стандартный rawMsg)
 *
 * @param {Array} responses - responses array
 * @returns {string}
 */
const processResponse = (responses) => {
  for (const res of responses) {
    const result = res.queryResult;

    if (result.intent) {
      switch (result.intent.name) {
        case INTENTS.BUY: {
          // if (result.parameters) {
          // price: result.parameters.fields.price
          // currency: result.parameters.fields.currency
          // }
          return result.fulfillmentText;
        }
        case INTENTS.EAT: {
          let outMessage = result.fulfillmentText;
          for (const eatValue of result.parameters.fields.Food.listValue
            .values) {
            // TODO: брать значения из database.foods;
            // заменить stringify
            // console.log(eatValue.stringValue)
            outMessage += '\n' + eatValue.stringValue;
          }
          return outMessage;
        }
        case INTENTS.FINANCE: {
          return result.fulfillmentText;
        }
        case INTENTS.FITNESS: {
          return result.fulfillmentText;
        }
        case INTENTS.WEIGHT: {
          return result.fulfillmentText;
        }
        case INTENTS.WORK: {
          return result.fulfillmentText;
        }
        default: {
          // No intent matched
          return '';
        }
      }
    }
  }
  return '';
};
/**
 * получаем и разбираем Intent (если есть)
 *
 * inputAnalyze('купил овощи 30 рублей')
 *
 * @param {string} rawMsg - raw message
 * @returns {Promise<string>}
 */
const inputAnalyze = async (rawMsg) => {
  // TODO: на основе Intent'a делаем различные предположения и записываем в БД в структурированном виде
  // * анализируем введенный текст узнаем желания/намерение пользователя в более глубоком виде
  // * await language.analyze(input);
  const query = formatQuery(rawMsg);
  const responses = await detectTextIntent(query);
  const res = await processResponse(responses);
  return res;
};

module.exports = {
  inputAnalyze,
};
