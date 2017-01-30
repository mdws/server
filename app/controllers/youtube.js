const YouTube = require('../../lib/youtube');
const downloadResponse = require('../utils/downloadResponse');

module.exports = {
  * get() {
    try {
      const data = yield YouTube.download(this.state.url);
      yield downloadResponse(this, data);
    } catch (err) {
      this.log.error(err);
      this.status = 500;
    }
  },
};
