const express = require('express');
const jsonParser = require('body-parser').json();
const { TELEGRAM } = require('../environment');
const authParser = require('../middlewares/auth');
const robotsParser = require('../middlewares/robots');
const sitemapParser = require('../middlewares/sitemap');
const oidcParser = require('../middlewares/oidc');
const notFound = require('../middlewares/not-found-handler');
const setNoCache = require('../middlewares/no-cache');
const telegramAPI = require('../middlewares/telegram');
const mailAPI = require('../middlewares/mail');
const rpcAPI = require('../middlewares/jsonrpc');

const passportController = require('../controllers/web/passport');
const pingController = require('../controllers/web/ping');
const messageController = require('../controllers/web/message');
const oauthController = require('../controllers/web/oauth');
const oidcController = require('../controllers/web/oidc');

module.exports = (app) => {
  app.get('/oidcallback', oidcController.oidcallback);
  app.get('/interaction/:uid', setNoCache, oidcController.interactionUID);
  app.post(
    '/interaction/:uid/login',
    setNoCache,
    express.urlencoded(),
    oidcController.interactionLogin,
  );
  app.post(
    '/interaction/:uid/confirm',
    setNoCache,
    oidcController.interactionConfirm,
  );
  app.get(
    '/interaction/:uid/abort',
    setNoCache,
    oidcController.interactionAbort,
  );
  // подтверждение авторизации oauth. Сначала переходить сначала по ссылке вида https://cd0b2563.eu.ngrok.io/connect/yandex. Через localhost не будет работать
  app.get('/oauth', oauthController);
  // JSON-LD пользователя/организации
  // todo добавить список историй сылками и пагинацией <Array>
  //  список сообщений истории определенного пользователя
  app.get('/user/:uuid/:date', authParser, passportController);
  // отображение прикрепленных некий глобальный JSON-LD включающий ссылки на остальные документы
  // todo делать читаемыми только для того пользователя кто создал. Нужны роли для этого
  app.get('/message/:uuid', authParser, messageController);
  app.get('/robots.txt', robotsParser);
  app.get('/sitemap.txt', sitemapParser);
  // вебхуки нотификаций о почте, включая ассистентов
  app.post('/mail', jsonParser, mailAPI);
  // telegram
  app.post(`/bot${TELEGRAM.TOKEN}`, jsonParser, telegramAPI);
  app.get('/', authParser, pingController);
  // json rpc server
  app.post('/api*', jsonParser, authParser, rpcAPI);
  // OpenID Connect server
  app.use('/oidc/', oidcParser.callback);
  // 404 - not found - todo благодаря использованию oidsParser это не используется
  app.get('*', notFound);
};
