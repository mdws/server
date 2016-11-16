const ffmpeg = require('fluent-ffmpeg');
const formats = require('./formats');
const fs = require('fs');
const jsdom = require('jsdom');
const pify = require('pify');
const porygon = require('porygon');
const querystring = require('querystring');
const R = require('ramda');
const tempfile = require('tempfile');
const { crawler } = require('../utils');
const { VM } = require('vm2');

const readFile = pify(fs.readFile);
const writeFile = pify(fs.writeFile);
const unlink = pify(fs.unlink);

const convertVideo = R.curry((format, buffer) => {
  const tmp = tempfile();
  return writeFile(tmp, buffer)
    .then(() => new Promise((resolve, reject) => {
      ffmpeg(tmp)
        .format(format)
        .on('error', reject)
        .on('end', resolve)
        .save(tmp);
    }))
    .then(() => readFile(tmp))
    .then((buffer) => Promise.all([ buffer, unlink(tmp) ]))
    .then(R.head);
});

const getStreamAudio = R.curry((config, window, stream) => (
  porygon.buffer(`${window.location.protocol + config.assets.js}`)
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
      return porygon.buffer(streamUrl);
    })
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

      return getStreamAudio(config, window, stream);
    });

const download = downloadAudio;

module.exports = download;
