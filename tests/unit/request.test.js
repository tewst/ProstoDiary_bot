module.exports = (t) => {
  const requestService = require('../../src/services/request.service');
  t.is(requestService.toQueryString({ x: 1, y: '2', z: '3' }), '?x=1&y=2&z=3');
  t.is(requestService.toQueryString({ x: null, y: '2', z: undefined }), '?y=2');
  t.is(
    requestService.toQueryString({ x: '', y: '', z: 'undefined' }),
    '?z=undefined',
  );
};