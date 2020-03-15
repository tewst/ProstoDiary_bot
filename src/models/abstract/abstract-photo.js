const fileType = require('file-type');
const visionService = require('./vision.service');
const package_ = require('../../../../package');
const Abstract = require('../abstract/index');

class AbstractPhoto extends Abstract {
  constructor({imageBuffer, caption}) {
    super();
    this.imageBuffer = imageBuffer;
    this.caption = caption;
  }

  get context() {
    return {
      ...super.context,
      '@context': {
        schema: 'http://schema.org/',
      },
      '@type': 'Action',
      'agent': {
        '@type': 'Person',
        'name': package_.name,
      },
      'object': {
        '@type': 'CreativeWork',
        'name': 'photo',
        'abstract': encodeURIComponent(this.imageBuffer).toString('base64'),
        'encodingFormat': this.mime,
      },
    };
  }

  async prepare() {
    const { mime } = fileType(this.imageBuffer);
    this.mime = mime;
    const tags = [];
    const visionResult = await visionService.labelDetection(imageBuffer);
    // todo распознавать интент-намерение в самой картинке через Vision
    // ...
    visionResult.labelAnnotations.forEach((annotation) => {
      tags.push(annotation.description);
    });
  }
}

module.exports = AbstractPhoto;