/* eslint-disable global-require */
/* eslint no-param-reassign: ["error", { "props": false }] */

const fs = require('fs');
const path = require('path');

/**
 * Setup controllers
 */
const Controllers = fs
  .readdirSync(__dirname)
  .reduce((controllers, filename) => {
    if (filename === 'index.js') return controllers;

    const name = path.basename(filename, '.js');
    controllers[name] = require(path.join(__dirname, filename));

    return controllers;
  }, {});

module.exports = Controllers;
