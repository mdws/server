const SoundCloud = require('../../lib/soundcloud');
const downloadResponse = require('../utils/downloadResponse');

module.exports = {
  * get() {
    const format = this.query.format;
    const config = Object.assign({
      format,
    }, this.app.context.services.soundcloud);

    try {
      const data = yield SoundCloud.download(config, this.state.url);
      yield downloadResponse(this, data);
    } catch (err) {
      this.log.error(err);
      this.throw(500);
    }
  },
};
