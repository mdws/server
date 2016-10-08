const porygon = require('porygon');
const querystring = require('querystring');
const R = require('ramda');
const resolveUrl = require('./resolveUrl');
const Zip = require('jszip');
const { formatTrackName } = require('./utils');

/**
 * An Object containing track/playlist data from SoundCloud
 *
 * @typedef {Object} SoundCloudData
 * @property {Buffer} buffer
 * @property {string} filename
 */

/**
 * Downloads a track from data received from SoundCloud
 *
 * @param {Object} config
 * @param {string} config.clientId
 * @param {string} config.version
 * @param {string} [config.format]
 * @param {Object} data
 * @param {string} data.stream_url
 * @param {string} data.title
 * @param {number} [data.position]
 * @param {Object} data.user
 * @param {string} data.user.username
 *
 * @returns {Promise<SoundCloudData>}
 */
const downloadFromData = R.curry((config, data) => {
  const query = querystring.stringify({
    client_id: config.clientId,
    app_version: config.version,
  });

  const getStream = R.pipe(
    R.prop('stream_url'),
    R.concat(R.__, `?${query}`),
    porygon.buffer
  );

  return getStream(data).then(R.pipe(
    JSON.parse,
    R.prop('location'),
    porygon.buffer
  )).then(buffer => ({
    buffer,
    filename: `${formatTrackName(config.format, data)}.mp3`,
  }));
});

/**
 * Downloads a track from the specified SoundCloud's url
 *
 * @param {Object} config
 * @param {string} config.clientId
 * @param {string} config.version
 * @param {string} [config.format]
 * @param {string} url
 *
 * @returns {Promise<SoundCloudData>}
 */
const downloadTrack = R.curry((config, url) => (
  resolveUrl(config.clientId, url).then(downloadFromData(config))
));

/**
 * Downloads a playlist from the specified SoundCloud's url
 *
 * @param {Object} config
 * @param {string} config.clientId
 * @param {string} config.version
 * @param {string} [config.format]
 * @param {string} url
 *
 * @returns {Promise<SoundCloudData>}
 */
const downloadPlaylist = R.curry((config, url) => {
  let album;
  return resolveUrl(config.clientId, url).then((data) => {
    album = data.title;
    const promises = data.tracks.map(R.pipe(
      (track, index) => R.assoc('position', index + 1, track),
      downloadFromData(config)
    ));

    return Promise.all(promises);
  }).then(R.pipe(
    R.reduce((zip, data) => zip.file(data.filename, data.buffer), new Zip()),
    zip => zip.generateAsync({ type: 'nodebuffer' })
  )).then(buffer => ({
    buffer,
    filename: `${album}.zip`,
  }));
});

/** @module Download */
module.exports = {
  playlist: downloadPlaylist,
  track: downloadTrack,
};
