const Bandcamp = require('../../lib/bandcamp');
const downloadRedirect = require('../utils/downloadRedirect');

module.exports = {
  * get() {
    const format = this.query.format;

    try {
      const data = yield Bandcamp.download(format, this.state.url);
      yield downloadRedirect(this, data);
    } catch (err) {
      this.log.error(err);
      this.status = 500;
    }
  },
};
