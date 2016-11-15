const jsdom = require('jsdom');
const porygon = require('porygon');
const querystring = require('querystring');
const R = require('ramda');
const { crawler } = require('../utils');
const { VM } = require('vm2');

const downloadFormat = R.curry((config, window, format) => (
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
      const audioUrl = `${format.url}&signature=${decipher(format.s)}`;

      window.close();
      return porygon.buffer(audioUrl);
    }).then(buffer => ({
      buffer,
      filename: `${config.args.title}.mp3`,
    }))
));

const downloadAudio = youtubeUrl =>
  porygon.buffer(youtubeUrl)
    .then(crawler)
    .then(({ window }) => {
      const config = window.ytplayer.config;
      const formats = R.pipe(
        R.split(','),
        R.map(querystring.parse)
      )(config.args.adaptive_fmts);

      // Get audio format with highest quality
      const format = R.pipe(
        R.sort((x, y) => y.bitrate - x.bitrate),
        R.find(R.compose(R.contains('audio/webm'), R.prop('type')))
      )(formats);

      // Change URL so that the window object location's property is set
      // PS: It's needed for the JS asset file
      jsdom.changeURL(window, youtubeUrl);

      return downloadFormat(config, window, format);
    });

const download = downloadAudio;

module.exports = download;
