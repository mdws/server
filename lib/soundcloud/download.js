const porygon = require('porygon');
const querystring = require('querystring');
const R = require('ramda');
const Zip = require('jszip');
const { formatTrackName, id3 } = require('./utils');

/**
 * An Object containing track/playlist data from SoundCloud
 *
 * @typedef {Object} SoundCloudData
 * @property {Buffer} buffer
 * @property {string} filename
 */

/**
 * Downloads a track from data received from SoundCloud's resolver
 *
 * @param {Object} config
 * @param {string} config.clientId
 * @param {string} config.version
 * @param {string} [config.format]
 * @param {Object} track
 *
 * @returns {Promise<SoundCloudData>}
 */
const downloadTrack = R.curry((config, track) => {
  const query = querystring.stringify({
    client_id: config.clientId,
    app_version: config.version,
  });

  const getStream = R.pipe(
    R.prop('stream_url'),
    R.concat(R.__, `?${query}`),
    porygon.buffer
  );

  return getStream(track)
    .then(id3(track))
    .then(buffer => ({
      buffer,
      filename: `${formatTrackName(config.format, track)}.mp3`,
    }));
});

/**
 * Downloads a playlist from data received from SoundCloud's resolver
 *
 * @param {Object} config
 * @param {string} config.clientId
 * @param {string} config.version
 * @param {string} [config.format]
 * @param {Object} playlist
 *
 * @returns {Promise<SoundCloudData>}
 */
const downloadPlaylist = R.curry((config, playlist) => {
  const tracks = playlist.tracks.map(R.pipe(
    (track, index) => R.assoc('position', index + 1, track),
    R.assoc('playlist', playlist.title),
    downloadTrack(config)
  ));

  return Promise.all(tracks).then(R.pipe(
    R.reduce((zip, data) => zip.file(data.filename, data.buffer), new Zip()),
    zip => zip.generateAsync({ type: 'nodebuffer' })
  )).then(buffer => ({
    buffer,
    filename: `${playlist.title}.zip`,
  }));
});

/**
 *
 */
const download = R.curry((config, data) => {
  switch (data.kind) {
    case 'track':
      return downloadTrack(config, data);
    case 'playlist':
      return downloadPlaylist(config, data);
    default:
      return Promise.reject(new Error(`Unrecognized kind '${data.kind}'`));
  }
});

/** @module download */
module.exports = download;
