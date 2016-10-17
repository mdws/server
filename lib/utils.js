const { jsdom } = require('jsdom');

/**
 * TODO: Document this function
 */
const crawler = html => new Promise((resolve) => {
  const document = jsdom(html);
  const window = document.defaultView;

  window.addEventListener('load', () => {
    resolve({ document, window });
    setTimeout(() => window.close(), 0);
  });
});

/**
 * Add URL protocol if it isn't specified
 *
 * @param {string} url
 *
 * @return {string}
 */
const fixUrl = url => (!/^https?:\/\//.test(url) ? `http://${url}` : url);

/** @module utils */
module.exports = {
  crawler,
  fixUrl,
};
