const bl = require('bl');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const pify = require('pify');
const R = require('ramda');
const tempfile = require('tempfile');
const ytdl = require('ytdl-core');

const unlink = pify(fs.unlink);
const getInfo = pify(ytdl.getInfo);

const convertVideo = R.curry((format, filename) => {
  const bufferStream = bl();
  return new Promise((resolve, reject) => {
    ffmpeg(filename)
      .format(format)
      .output(bufferStream, { end: true })
      .on('error', reject)
      .on('end', resolve)
      .run();
  })
  .then(() => unlink(filename))
  .then(() => bufferStream.slice());
});

const downloadAudio = info =>
  new Promise((resolve, reject) => {
    const tmp = tempfile();
    ytdl.downloadFromInfo(info)
      .pipe(fs.createWriteStream(tmp))
      .on('error', reject)
      .on('finish', () => resolve(tmp));
  })
  .then(convertVideo('mp3'))
  .then(buffer => ({
    buffer,
    filename: `${info.title}.mp3`,
  }));

const download = url =>
  getInfo(url, { quality: 'lowest' })
    .then(downloadAudio);

module.exports = download;
