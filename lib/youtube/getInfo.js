const ytdl = require('ytdl-core');
const pify = require('pify');

const getInfoP = pify(ytdl.getInfo);

/**
 *
 */
const getInfo = url =>
  getInfoP(url, { quality: 'lowest' })
    .then(info => ({
      title: info.title,
      user: info.author.name,
      artwork: info.thumbnail_url,
      duration: info.length_seconds * 1000,
      data: JSON.stringify(info),
    }));

/** @module getInfo */
module.exports = getInfo;
