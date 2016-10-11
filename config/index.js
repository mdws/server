require('dotenv').config();

const R = require('ramda');

module.exports = {
  app: {
    env: R.defaultTo('development', process.env.NODE_ENV),
    port: R.defaultTo('8000', process.env.PORT),
  },
};
