const exportLocation = require('../utils/exportLocation');
const HttpStatus = require('http-status-codes');
const SoundCloud = require('../../lib/soundcloud');
const { fixUrl } = require('../../lib/utils');

module.exports = {
  * info() {
    const config = this.app.context.services.soundcloud;

    try {
      const url = fixUrl(this.query.url);
      this.body = yield SoundCloud.getInfo(config.clientId, url);
    } catch (err) {
      this.log.error(err);
      this.throw(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  },

  * download() {
    const format = this.query.format;
    const config = Object.assign({
      format,
    }, this.app.context.services.soundcloud);

    try {
      const data = yield SoundCloud.download(config, this.request.body);
      yield exportLocation(this, data);
    } catch (err) {
      this.log.error(err);
      this.throw(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  },
};
