const parser = require('fast-xml-parser');
const { unpack } = require('./archive.service');
const logger = require('./logger.service');

const uploadToDatabase = (object) => {
  logger.log('info', object);
  // console.log(jsonObj.ClinicalDocument.entry)
  // console.log(jsonObj.HealthData.ExportDate)
  // console.log(jsonObj.HealthData.Me)

  // console.log(jsonObj.HealthData.Record[0])
  /*
  {
    type: 'HKQuantityTypeIdentifierBodyMass',
    sourceName: 'Mi Fit',
    sourceVersion: '201811061641',
    unit: 'kg',
    creationDate: '2018-12-13 22:54:08 +0300',
    startDate: '2018-12-13 20:05:44 +0300',
    endDate: '2018-12-13 20:05:44 +0300',
    value: '69'
  }
   */

  // console.log(jsonObj.HealthData.Record[10]);
  /*
    {
      type: 'HKQuantityTypeIdentifierHeartRate',
      sourceName: 'Mi Fit',
      sourceVersion: '201812111118',
      unit: 'count/min',
      creationDate: '2018-12-21 12:56:31 +0300',
      startDate: '2018-12-21 11:03:00 +0300',
      endDate: '2018-12-21 11:03:59 +0300',
      value: '63'
    }
  */

  // TYPES:
  // HKQuantityTypeIdentifierBodyMass
  // HKQuantityTypeIdentifierHeartRate
  // HKQuantityTypeIdentifierStepCount
  // HKQuantityTypeIdentifierDistanceWalkingRunning
  // HKQuantityTypeIdentifierActiveEnergyBurned

  // const uniqueSet = new Set(jsonObj.HealthData.Record.map(record => record.type));
  // console.log(
  //   uniqueSet
  // )
};

/**
 * @function
 * @param {Buffer} buffer - value
 * @returns {Promise<object>}
 */
const uploadAppleHealthData = async (buffer) => {
  const mapBuffer = await unpack(buffer);
  if (mapBuffer.size === 0) {
    throw new Error('Empty file');
  }
  const parserOptions = {
    attributeNamePrefix: '',
    ignoreAttributes: false,
    ignoreNameSpace: false,
    allowBooleanAttributes: true,
    parseNodeValue: true,
    parseAttributeValue: false,
    trimValues: true,
    parseTrueNumberOnly: false,
  };
  mapBuffer.forEach((buffer) => {
    const string = buffer.toString('utf8');
    const jsonObject = parser.parse(string, parserOptions);
    uploadToDatabase(jsonObject);
  });
};

module.exports = {
  uploadAppleHealthData,
};
