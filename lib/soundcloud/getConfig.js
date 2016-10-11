const cheerio = require('cheerio');
const porygon = require('porygon');
const R = require('ramda');

/**
 * Constants
 */
const SOUNDCLOUD_URL = 'https://soundcloud.com';

/**
 * Resolves an object with SoundCloud's version and clientId
 *
 * @returns {Promise<Object>}
 */
const getConfig = () => {
  const config = {};
  return porygon.buffer(SOUNDCLOUD_URL).then((buf) => {
    const $ = cheerio.load(buf);

    const re = /__sc_version\s?=\s?"([^"]*)"/;
    const matches = R.match(re, $('script[type]').text());

    if (!matches) return Promise.reject(new Error('No app_version found'));
    config.version = matches[1];

    const scripts = $('script[src]').map(R.pipe(
      (_, e) => $(e).attr('src'),
      porygon.buffer
    )).get();

    return Promise.all(scripts);
  }).then((scripts) => {
    const re = /[^A-z0-9_]client_id:"([^"]*)"/;
    const script = scripts.find(R.test(re));
    const matches = R.match(re, String(script));

    if (!matches) return Promise.reject(new Error('No client_id found'));
    config.clientId = matches[1];

    return config;
  });
};

/** @module getConfig */
module.exports = getConfig;
