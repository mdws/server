const Bandcamp = require('../../lib/bandcamp');

module.exports = {
  * get() {
    const format = this.request.query.format;

    try {
      const data = yield Bandcamp.download(format, url);
      this.attachment(data.filename);
      this.body = data.buffer;
    } catch (err) {
      // TODO: Add logging
      console.error(err);
      this.status = 500;
    }
  }
};
