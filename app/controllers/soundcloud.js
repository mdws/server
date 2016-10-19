const SoundCloud = require('../../lib/soundcloud');

module.exports = {
  * get() {
    const format = this.request.query.format;
    const config = Object.assign({
      format,
    }, this.app.context.services.soundcloud);

    try {
      const data = yield SoundCloud.download(config, this.state.url);
      this.attachment(data.filename);
      this.body = data.buffer;
    } catch (err) {
      // TODO: Add logging
      console.error(err);
      this.throw(500);
    }
  },
};
