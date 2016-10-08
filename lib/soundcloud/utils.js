const R = require('ramda');

/**
 * Constants
 */
const DEFAULT_TRACK_FORMAT = '{track} {title} - {artist}';

/**
 * Formats a track name
 *
 * @param {string} format
 * @param {Object} track
 * @param {string} track.title
 * @param {number} [track.position]
 * @param {Object} track.user
 * @param {string} track.user.username
 *
 * @returns {string}
 */
const formatTrackName = R.curry((format, track) => (
  (!format || !format.includes('{title}') ? DEFAULT_TRACK_FORMAT : format)
    .replace('{track}', track.position)
    .replace('{title}', track.title)
    .replace('{artist}', track.user.username)
    .trim()
));

/** @module utils */
module.exports = {
  formatTrackName,
};
