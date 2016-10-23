const fs = require('fs');
const path = require('path');
const pify = require('pify');
const { tmpdir } = require('os');

const TMPDIR = tmpdir();
const readFile = pify(fs.readFile);

module.exports = {
  * get() {
    const filename = this.query.f;
    const tmpfile = path.join(TMPDIR, this.params.id);

    try {
      this.attachment(filename);
      this.body = yield readFile(tmpfile);
    } catch (err) {
      // TODO: Add logging
      console.error(err);
      this.throw(500);
    } finally {
      fs.unlink(tmpfile);
    }
  },
};
