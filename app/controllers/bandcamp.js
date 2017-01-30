const Bandcamp = require('../../lib/bandcamp');
const downloadResponse = require('../utils/downloadResponse');

module.exports = {
  * get() {
    const format = this.query.format;

    try {
      const data = yield Bandcamp.download(format, this.state.url);
      yield downloadResponse(this, data);
    } catch (err) {
      this.log.error(err);
      this.status = 500;
    }
  },
};
