/* eslint no-underscore-dangle: ["error", { "allow": ["__sc_version"] }] */

const porygon = require('porygon');
const R = require('ramda');
const { crawler } = require('../utils');

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
  return porygon.buffer(SOUNDCLOUD_URL)
    .then(crawler)
    .then(({ document, window }) => {
      if (!window.__sc_version) return Promise.reject(new Error('No app_version found'));
      config.version = window.__sc_version;

      const scripts = Array.from(document.querySelectorAll('script[src]'));
      const prms = scripts.map(R.pipe(
        e => e.getAttribute('src'),
        porygon.buffer
      ));

      return Promise.all(prms);
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
