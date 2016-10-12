const SoundCloud = require('../../lib/soundcloud');
const { fixUrl } = require('../../lib/utils');

const index = function* index() {
  const queryUrl = this.request.query.url;

  // No url specified, bad request
  if (!queryUrl) {
    this.status = 400;
    return;
  }

  const url = fixUrl(queryUrl);
  const format = this.request.query.format;

  const config = this.app.context.services.soundcloud;
  config.format = format;

  try {
    const data = yield SoundCloud.download(config, url);
    this.set('Content-Disposition', `attachment; filename="${data.filename}"`);
    this.body = data.buffer;
  } catch (err) {
    // TODO: Add logging
    console.error(err);
    this.status = 500;
  }
};

module.exports = {
  index,
};
