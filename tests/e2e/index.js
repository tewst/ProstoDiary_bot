const {
  test,
  skipTestForFastOrTravis,
  skipTestForFast,
} = require('../helpers');
const { maintainers } = require('../../package');
const TelegramServer = require('telegram-test-api');
const sgMail = require('@sendgrid/mail');
const { IS_CI, IS_DEV } = require('../../src/environment');

// This runs before all tests
test.before(async (t) => {
  // TODO: для dev запускаем БД сервак. В дальнейшем включить полноценно для E2E - https://github.com/gotois/ProstoDiary_bot/issues/3
  if (IS_DEV || process.env.NODE_ENV === 'test') {
    const dbClient = require('../../src/database');
    await t.notThrowsAsync(async () => {
      await dbClient.client.connect();
    });
    t.true(dbClient.client._connected);
  }
  const server = new TelegramServer({
    port: process.env.TELEGRAM_SERVER_PORT,
    host: 'localhost',
    storage: 'RAM',
    storeTimeout: 60,
  });
  await server.start();
  const bot = require('../../src/core');
  const client = server.getClient(process.env.TELEGRAM_TOKEN);
  require('../../src/core/handlers')(bot);
  /*eslint-disable require-atomic-updates */
  t.context.server = server;
  t.context.client = client;
  t.context.tasks = {};
  /*eslint-enable */
  t.pass();
});

test.beforeEach((t) => {
  const startedTestTitle = t.title.replace('beforeEach hook for ', '');
  t.context.tasks[startedTestTitle] = startedTestTitle;
});

test.afterEach((t) => {
  const successTestTitle = t.title.replace('afterEach hook for ', '');
  delete t.context.tasks[successTestTitle];
});

// This runs after all tests
test.after('cleanup', (t) => {
  t.context.testPassed = true;
});

test.after.always('guaranteed cleanup', async (t) => {
  if (t.context.testPassed) {
    return;
  }
  const failedTasks = Object.entries(t.context.tasks).map(([taskName]) => {
    return taskName;
  });
  if (failedTasks.length === 0) {
    return;
  }
  t.log('Failed: ', failedTasks);
  if (process.env.FAST_TEST) {
    return;
  }
  if (IS_CI) {
    return;
  }
  if (IS_DEV) {
    return;
  }
  const message = {
    to: maintainers[0].email,
    from: 'no-reply@gotointeractive.com',
    subject: 'ProstoDiary: 👾 E2E failed',
    text: `Failed test: ${JSON.stringify(failedTasks, null, 2)}`,
  };
  const [mailResult] = await sgMail.send(message);
  t.true(mailResult.statusCode >= 200 && mailResult.statusCode < 300);
});

// Database
skipTestForFastOrTravis('DB: Foods', require('./database.test').databaseFoods);

// API
skipTestForFast('API: speller service', require('./speller-service.test'));
skipTestForFast('API: request', require('./request.test'));
skipTestForFast('API: Weather', require('./weather.test'));
skipTestForFast('API: RestContries', require('./restcountries.test'));
skipTestForFast('API: plotly', require('./graph-service.test'));
skipTestForFastOrTravis('API: googleapis Geocode', require('./geocode.test'));
skipTestForFastOrTravis('API: Fatsecret', require('./fatsecret.test'));
skipTestForFastOrTravis('API: Google Vision', require('./vision.test'));
skipTestForFastOrTravis('API: KPP nalog.ru', require('./kpp.test'));
skipTestForFastOrTravis('API: Translate', require('./translate.test'));
skipTestForFast('API: Wolfram Alpha', require('./wolfram-alpha.test'));
skipTestForFastOrTravis('API: Todoist', require('./todoist-service.test'));
skipTestForFast('API: Currency', require('./currency-service.test'));

// INPUT
skipTestForFast('/help', require('./help.test'));
skipTestForFast('/version', require('./version.test'));
skipTestForFastOrTravis('/backup', require('./backup.test'));
skipTestForFastOrTravis('/text', require('./text.test'));
skipTestForFastOrTravis('/balance', require('./balance.test'));
skipTestForFastOrTravis('INPUT: voice', require('./voice.test'));
test.todo('/start'); // + авторизация;
test.todo('/dbclear');
test.todo('/search');

skipTestForFastOrTravis('archive service', require('./archive-service.test'));
skipTestForFastOrTravis('AppleHealth', require('./apple-health-service.test'));
skipTestForFastOrTravis('Tinkoff', require('./tinkoff-service.test'));

test('bot init', require('./telegram-bot.test'));
skipTestForFastOrTravis('foursquare', require('./foursquare-service.test'));

test.todo('Создать отдельного пользователя в БД'); // TODO: используя https://github.com/marak/Faker.js/
test.todo('Проверка удаления своей записи');
test.todo('Запись энтри');
test.todo('Проверека построения графика');
