const exportLocation = require('../utils/exportLocation');
const HttpStatus = require('http-status-codes');
const YouTube = require('../../lib/youtube');
const { fixUrl } = require('../../lib/utils');

module.exports = {
  * info() {
    try {
      const url = fixUrl(this.query.url);
      this.body = yield YouTube.getInfo(url);
    } catch (err) {
      this.log.error(err);
      this.throw(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  },

  * download() {
    try {
      const data = yield YouTube.download(this.request.body);
      yield exportLocation(this, data);
    } catch (err) {
      this.log.error(err);
      this.throw(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  },
};
