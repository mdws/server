const moment = require('moment');
const porygon = require('porygon');
const R = require('ramda');
const { crawler } = require('../utils');

/**
 *
 */
const getInfo = url =>
  porygon.buffer(url)
    .then(crawler)
    .then(({ document, window }) => {
      const data = window.TralbumData;
      const album = window.EmbedData;
      const tracks = data.trackinfo;

      const artwork = document.querySelector('#tralbumArt .popupImage img');
      album.artwork = artwork.getAttribute('src');

      const releaseDate = moment(data.album_release_date, 'DD MMM YYYY hh:mm:ss');
      album.release_year = releaseDate.format('YYYY');

      const durationInMs = R.pipe(
        R.pluck('duration'),
        R.sum,
        R.multiply(1000)
      )(tracks);

      const info = {
        title: data.current.title,
        user: data.artist,
        artwork: album.artwork,
        duration: durationInMs,
        data: JSON.stringify({
          album,
          tracks,
          item_type: data.item_type,
        }),
      };

      window.close();
      return info;
    });

/** @module getInfo */
module.exports = getInfo;
