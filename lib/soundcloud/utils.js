const ID3Writer = require('browser-id3-writer');
const porygon = require('porygon');
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
    .replace('{track}', R.defaultTo('', track.position))
    .replace('{title}', track.title)
    .replace('{artist}', track.user.username)
    .trim()
));

/**
 * Tags a Buffer using SoundCloud's track data
 *
 * @param {Object} track
 * @param {Buffer} buffer
 *
 * @returns {Promise<Buffer>}
 */
const id3 = R.curry((track, buffer) => {
  const artworkUrl = track.artwork_url.replace('large', 't500x500');
  return porygon.buffer(artworkUrl).then((artwork) => {
    const writer = new ID3Writer(buffer);

    writer
      .setFrame('TPE1', [track.user.username])
      .setFrame('TCON', [track.genre])
      .setFrame('TIT2', track.title)
      .setFrame('TLEN', track.duration)
      .setFrame('APIC', artwork);

    if (track.playlist && track.position) {
      writer
        .setFrame('TALB', track.playlist)
        .setFrame('TPE2', track.user.username)
        .setFrame('TRCK', track.position);
    }

    writer.addTag();
    return Buffer.from(writer.arrayBuffer);
  });
});

/** @module utils */
module.exports = {
  formatTrackName,
  id3,
};
