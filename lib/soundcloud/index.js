const Download = require('./download');
const getInfo = require('./getInfo');
const resolveUrl = require('./resolveUrl');

/** @module SoundCloud */
module.exports = {
  getInfo,
  resolveUrl,
  downloadPlaylist: Download.playlist,
  downloadTrack: Download.track,
};
