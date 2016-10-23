const { fixUrl } = require('../../lib/utils');

function* serviceValidator(next) {
  const url = this.query.url;

  // No url, bad request
  if (!url) {
    this.throw(400);
    return;
  }

  this.state.url = fixUrl(url);
  yield next;
}

module.exports = serviceValidator;
