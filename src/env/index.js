const {
  NODE_ENV,

  DB_HOST,
  DB_NAME,
  DB_USER_NAME,
  DB_PORT,
  DB_PASSWORD,
  SALT_PASSWORD,

  CORALOGIX_WINSTON_PRIVATE_KEY,
  CORALOGIX_WINSTON_APPLICATION_NAME,

  GOOGLE_APPLICATION_CREDENTIALS,
  GOOGLE_MAPS_GEOCODING_API,

  TELEGRAM_TOKEN,

  PORT,
  SERVER_NAME,

  DIALOGFLOW_CREDENTIALS,
  DIALOGFLOW_PROJECT_ID,

  PLOTLY_LOGIN,
  PLOTLY_TOKEN,

  NALOGRU_EMAIL,
  NALOGRU_NAME,
  NALOGRU_PHONE,
  NALOGRU_KP_PASSWORD,

  FAT_SECRET_APPNAME,
  FAT_SECRET_API_ACCESS_KEY,
  FAT_SECRET_API_SHARED_SECRET,

  SENDGRID_API_KEY,

  OPEN_WEATHER_KEY,
} = process.env;

module.exports = {
  DATABASE: {
    databaseHost: DB_HOST,
    databaseName: DB_NAME,
    databaseUser: DB_USER_NAME,
    databasePort: DB_PORT,
    password: DB_PASSWORD,
    get passwordSalt() {
      return SALT_PASSWORD;
    },
  },
  CORALOGIX: {
    CORALOGIX_WINSTON_PRIVATE_KEY,
    CORALOGIX_WINSTON_APPLICATION_NAME,
  },
  TELEGRAM: {
    TOKEN: TELEGRAM_TOKEN,
    get WEB_HOOK_URL() {
      if (!SERVER_NAME || !TELEGRAM_TOKEN) {
        throw new Error('Env error: SERVER_NAME or TOKEN not found');
      }
      return `https://${SERVER_NAME}.herokuapp.com/bot${TELEGRAM_TOKEN}`;
    },
  },
  SERVER: {
    PORT,
  },
  PLOTLY: {
    PLOTLY_LOGIN,
    PLOTLY_TOKEN,
  },
  NALOGRU: {
    NALOGRU_EMAIL,
    NALOGRU_NAME,
    NALOGRU_PHONE,
    NALOGRU_KP_PASSWORD,
  },
  FAT_SECRET: {
    FAT_SECRET_APPNAME,
    FAT_SECRET_API_ACCESS_KEY,
    FAT_SECRET_API_SHARED_SECRET,
  },
  SENDGRID: {
    SENDGRID_API_KEY,
  },
  OPEN_WEATHER: {
    OPEN_WEATHER_KEY,
  },
  GOOGLE: {
    GOOGLE_MAPS_GEOCODING_API,
    get GOOGLE_CREDENTIALS_PARSED() {
      if (!GOOGLE_APPLICATION_CREDENTIALS) {
        throw new Error(
          'Env error: GOOGLE_APPLICATION_CREDENTIALS is not initialized',
        );
      }
      return JSON.parse(GOOGLE_APPLICATION_CREDENTIALS);
    },
  },
  DIALOGFLOW: {
    DIALOGFLOW_PROJECT_ID,
    get DIALOGFLOW_CREDENTIALS() {
      if (!DIALOGFLOW_CREDENTIALS) {
        throw new Error('Env error: DIALOGFLOW_CREDENTIALS is not initialized');
      }
      return JSON.parse(DIALOGFLOW_CREDENTIALS);
    },
  },
  get IS_PRODUCTION() {
    return String(NODE_ENV) === 'production';
  },
  get IS_CI() {
    return String(NODE_ENV) === 'TRAVIS_CI';
  },
  get IS_DEV() {
    const isAvaTest = String(NODE_ENV) === 'test';
    const isDevelopmentRun = String(NODE_ENV) === 'development';
    return !NODE_ENV || isDevelopmentRun || isAvaTest;
  },
};
