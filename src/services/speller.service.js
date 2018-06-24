const request = require('request');
const {replaceBetween} = require('./text.service');
/**
 * @param text {string}
 * @returns {Promise<Array>}
 */
const spellCheck = (text) => {
  return new Promise((resolve, reject) => {
    request({
      url: 'https://speller.yandex.net/services/spellservice.json/checkText',
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      form: {
        format: 'plain',
        text: text,
      },
      json: true,
    }, (error, response, body) => {
      if (error) {
        return reject(error);
      }
      if (!Array.isArray(body)) {
        return reject(body);
      }
    
      resolve(body);
    });
  });
};
/**
 * @param myText {string}
 * @returns {Promise<string>}
 */
const spellText = async (myText) => {
  let out = myText;
  const array = await spellCheck(myText);
  
  for (let a of array) {
    const replacedWord = a.s[0];
    out = replaceBetween(out, a.pos, a.pos + a.len, replacedWord);
  }
  
  return out;
};

module.exports = {
  spellCheck,
  spellText,
};