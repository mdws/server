const SoundCloud = require('../../lib/soundcloud');
const downloadRedirect = require('../utils/downloadRedirect');

module.exports = {
  * get() {
    const format = this.query.format;
    const config = Object.assign({
      format,
    }, this.app.context.services.soundcloud);

    try {
      const data = yield SoundCloud.download(config, this.state.url);
      yield downloadRedirect(this, data);
    } catch (err) {
      // TODO: Add logging
      console.error(err);
      this.throw(500);
    }
  },
};
