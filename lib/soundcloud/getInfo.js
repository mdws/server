/* global window */
/* eslint no-underscore-dangle: ["error", { "allow": ["__sc_version"] }] */

const nightmare = require('nightmare');
const querystring = require('querystring');
const url = require('url');

/**
 * Constants
 */
const SOUNDCLOUD_URL = 'https://soundcloud.com';

/**
 * Resolves an object with SoundCloud's version and clientId
 *
 * @return Promise<Object>
 */
const getInfo = () => {
  const browser = nightmare();
  const info = {};

  return browser.on('did-get-response-details', (...data) => {
    const foundUrl = data.find(x => x.includes && x.includes('client_id='));
    if (!foundUrl) return;

    const parsedUrl = url.parse(foundUrl);
    const parsedQuery = querystring.parse(parsedUrl.query);

    info.clientId = parsedQuery.client_id;
  })
  .goto(SOUNDCLOUD_URL)
  .evaluate(() => window.__sc_version)
  .end()
  .then((version) => {
    info.version = version;
    return info;
  });
};

/** @module getInfo */
module.exports = getInfo;
