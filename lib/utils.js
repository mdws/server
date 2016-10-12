/**
 * Add URL protocol if it isn't specified
 *
 * @param {string} url
 *
 * @return {string}
 */
const fixUrl = url => (!/^https?:\/\//.test(url) ? `http://${url}` : url);

/** @module utils */
module.exports = {
  fixUrl,
};
