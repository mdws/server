const exportLocation = require('../utils/exportLocation');
const HttpStatus = require('http-status-codes');
const Bandcamp = require('../../lib/bandcamp');
const { fixUrl } = require('../../lib/utils');

module.exports = {
  * info() {
    try {
      const url = fixUrl(this.query.url);
      this.body = yield Bandcamp.getInfo(url);
    } catch (err) {
      this.log.error(err);
      this.throw(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  },

  * download() {
    try {
      const data = yield Bandcamp.download(this.query.format, this.request.body);
      yield exportLocation(this, data);
    } catch (err) {
      this.log.error(err);
      this.throw(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  },
};
