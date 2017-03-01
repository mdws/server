const porygon = require('porygon');
const R = require('ramda');
const Zip = require('jszip');
const { formatTrackName, id3 } = require('./utils');

/**
 *
 */
const downloadTrack = R.curry((trackFormat, album, track) => (
  porygon.buffer(`https:${track.file['mp3-128']}`)
    .then(id3(album, track))
    .then(buffer => ({
      buffer,
      filename: `${formatTrackName(trackFormat, album, track)}.mp3`,
    }))
));

/**
 *
 */
const downloadAlbum = R.curry((trackFormat, album, tracks) => (
  Promise.all(tracks.map(downloadTrack(trackFormat, album)))
    .then(R.pipe(
      R.reduce((zip, data) => zip.file(data.filename, data.buffer), new Zip()),
      zip => zip.generateAsync({ type: 'nodebuffer' })
    )).then(buffer => ({
      buffer,
      filename: `${album.album_title}.zip`,
    }))
));

/**
 *
 */
const download = R.curry((trackFormat, data) => {
  switch (data.item_type) {
    case 'track':
      return downloadTrack(trackFormat, data.album, data.tracks[0]);
    case 'album':
      return downloadAlbum(trackFormat, data.album, data.tracks);
    default:
      return Promise.reject(new Error(`Unrecognized type '${data.item_type}'`));
  }
});

/** @module download */
module.exports = download;
