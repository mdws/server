const ID3Writer = require('browser-id3-writer');
const get = require('get-then');
const R = require('ramda');

const DEFAULT_TRACK_FORMAT = '{title} - {artist}';

const formatTrackName = R.curry((format, album, track) => (
  (!format || !format.includes('{title}') ? DEFAULT_TRACK_FORMAT : format)
    .replace('{track}', track.track_num)
    .replace('{title}', track.title)
    .replace('{artist}', album.artist)
    .trim()
));

const id3 = R.curry((album, track, buffer) => (
  get(album.artwork).then((artwork) => {
    const writer = new ID3Writer(buffer);

    writer
      .setFrame('TPE1', [album.artist])
      .setFrame('TIT2', track.title)
      .setFrame('TLEN', track.duration * 1000)
      .setFrame('TALB', album.album_title)
      .setFrame('TPE2', album.artist)
      .setFrame('TYER', album.release_year)
      .setFrame('APIC', artwork);

    if (track.track_num) {
      writer.setFrame('TRCK', track.track_num);
    }

    writer.addTag();
    return Buffer.from(writer.arrayBuffer);
  })
));

module.exports = {
  formatTrackName,
  id3,
};
