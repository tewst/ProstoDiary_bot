const { createPhotoBuffer } = require('../../services/graph.service');
const commands = require('../../commands');
const datetime = require('../../services/date.service');
const { createRegexInput } = require('../../services/text.service');
const { decodeRows } = require('../../services/format.service');
const dbEntries = require('../../database/entities.database');

module.exports = async (text, currentUser) => {
  const input = text
    .replace(commands.GRAPH.alias, '')
    .trim()
    .toLowerCase();
  const regExp = createRegexInput(input);

  const rows = await dbEntries.getAll(currentUser.id);
  const entryRows = decodeRows(rows).filter(({ entry }) => {
    return regExp.test(entry.toLowerCase());
  });
  const firstDate = rows[0].date_added;
  const latestDate = rows[rows.length - 1].date_added;
  const rangeTimes = datetime.fillRangeTimes(firstDate, latestDate);
  // TODO: из entryRows нужен только date
  const photoBuffer = await createPhotoBuffer(entryRows, rangeTimes);
  return {
    photoBuffer: photoBuffer,
    options: {
      caption: `График для "${regExp.toString()}"`,
      parse_mode: 'Markdown',
    },
  };
};