module.exports = (t) => {
  const SchemaOrg = require('../../src/lib/schema');
  const schemaOrg = new SchemaOrg();
  const placeGet = schemaOrg.get('Place');
  t.is(placeGet.label, 'Place');
};
