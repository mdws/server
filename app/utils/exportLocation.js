/* eslint no-param-reassign: ["error", { "props": false }] */

const fs = require('fs');
const pify = require('pify');
const R = require('ramda');
const tempfile = require('tempfile');
const url = require('url');
const { basename } = require('path');

const writeFile = pify(fs.writeFile);

/**
 *
 */
const exportLocation = R.curry((ctx, data) => {
  const tmp = tempfile();
  return writeFile(tmp, data.buffer).then(() => {
    const location = url.format({
      protocol: ctx.protocol,
      host: ctx.host,
      pathname: `/api/v1/export/${basename(tmp)}`,
      query: { f: data.filename },
    });

    ctx.body = { location };
  });
});

/** @module exportLocation */
module.exports = exportLocation;
