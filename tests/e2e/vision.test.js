const fs = require('fs');

module.exports = async (t) => {
  t.timeout(10000);
  const visionService = require('../../src/lib/vision');
  const buffer = fs.readFileSync('tests/data/photo/receipt-example-1.jpg');
  const result = await visionService.labelDetection(buffer);
  t.true(Array.isArray(result.labelAnnotations));
  const receipt = result.labelAnnotations.find((annotation) => {
    return annotation.description === 'Receipt';
  });
  t.is(typeof receipt === 'object', true);

  const buffer2 = fs.readFileSync('tests/data/photo/qr-example-1.jpg');
  const result2 = await visionService.labelDetection(buffer2);
  t.true(visionService.isQR(result2));
};
