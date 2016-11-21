const bl = require('bl');
const ffmpeg = require('fluent-ffmpeg');
const formats = require('./formats');
const fs = require('fs');
const jsdom = require('jsdom');
const pify = require('pify');
const porygon = require('porygon');
const querystring = require('querystring');
const R = require('ramda');
const tempfile = require('tempfile');
const url = require('url');
const { crawler } = require('../utils');
const { VM } = require('vm2');

const writeFile = pify(fs.writeFile);
const unlink = pify(fs.unlink);

const convertVideo = R.curry((format, buffer) => {
  const tmp = tempfile();
  return writeFile(tmp, buffer)
    .then(() => new Promise((resolve, reject) => {
      const bufferStream = bl();

      ffmpeg(tmp)
        .format(format)
        .output(bufferStream, { end: true })
        .on('error', reject)
        .on('end', () => resolve(
          Promise.all([bufferStream.slice(), unlink(tmp)]))
        )
        .run();
    }))
    .then(R.head);
});

const getStreamUrl = R.curry((window, assetPath, stream) => {
  if (stream.url.includes('signature=')) {
    window.close();
    return Promise.resolve(stream.url);
  }

  const assetUrl = R.pipe(
    url.parse,
    R.assoc('protocol', window.location.protocol),
    url.format
  )(assetPath);

  return porygon.buffer(assetUrl)
    .then((buffer) => {
      const code = String(buffer);
      const func = R.pipe(
        R.match(/\.sig\|\|([A-z0-9$]+)\(/),
        R.prop(1)
      )(code);

      // Setup VM to run the asset code
      const vm = new VM({
        sandbox: { window },
      });

      // Modify the code to get the decipher function
      const ref = 'window.DECIPHER';
      const modifiedCode = R.pipe(
        R.replace(/var window=this;/, ''),
        R.replace(/;}\)\(_yt_player\);/, `;${ref}=${func};})(_yt_player);`),
        R.concat(R.__, `; ${ref};`)
      )(code);

      const decipher = vm.run(modifiedCode);
      const streamUrl = `${stream.url}&signature=${decipher(stream.s)}`;

      window.close();
      return streamUrl;
    });
});

const getStreamAudio = R.curry((window, config, stream) => (
  getStreamUrl(window, config.assets.js, stream)
    .then(porygon.buffer)
    .then(convertVideo('mp3'))
    .then(buffer => ({
      buffer,
      filename: `${config.args.title}.mp3`,
    }))
));

const downloadAudio = youtubeUrl =>
  porygon.buffer(youtubeUrl)
    .then(crawler)
    .then(({ window }) => {
      const config = window.ytplayer.config;
      const streams = R.pipe(
        R.split(','),
        R.map(R.pipe(
          querystring.parse,
          (stream) => {
            const format = formats.find(R.propEq('itag', stream.itag));
            return R.merge(stream, { audioBitrate: format.audioBitrate });
          }
        ))
      )(config.args.url_encoded_fmt_stream_map);

      // Get stream with highest audio bitrate
      const stream = R.pipe(
        R.sort((x, y) => y.audioBitrate - x.audioBitrate),
        R.head
      )(streams);

      // Change URL so that the window object location's property is set
      // PS: It's needed for the JS asset file
      jsdom.changeURL(window, youtubeUrl);

      return getStreamAudio(window, config, stream);
    });

const download = downloadAudio;

module.exports = download;
