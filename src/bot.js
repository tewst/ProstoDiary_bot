const client = require('./database/database.client.js');

client.connect(error => {
  if (error) {
    console.error(error);
    throw error;
  }
  const bot = require('./bot.config');
  bot.getMe().then(() => {
    console.log('Bot started');
    require('./bot.events/bot.events.js');
  }).catch(error => {
    console.error(error);
  });
});
