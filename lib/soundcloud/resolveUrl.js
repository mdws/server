const porygon = require('porygon');
const querystring = require('querystring');
const R = require('ramda');

/**
 * Constants
 */
const RESOLVE_URI = 'https://api.soundcloud.com/resolve';

/**
 * Resolves a SoundCloud URL and return data
 * from its location
 *
 * @param {string} clientId
 * @param {string} url
 *
 * @returns {Promise<Object>}
 */
const resolveUrl = R.curry((clientId, url) => {
  const query = querystring.stringify({
    url,
    client_id: clientId,
  });

  return porygon.buffer(`${RESOLVE_URI}?${query}`)
    .then(R.pipe(JSON.parse, R.prop('location'), porygon.buffer))
    .then(JSON.parse);
});

/** @module resolveUrl */
module.exports = resolveUrl;
