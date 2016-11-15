const YouTube = require('../../lib/youtube');
const downloadRedirect = require('../utils/downloadRedirect');

module.exports = {
  * get() {
    try {
      const data = yield YouTube.download(this.state.url);
      yield downloadRedirect(this, data);
    } catch (err) {
      this.log.error(err);
      this.status = 500;
    }
  },
};
