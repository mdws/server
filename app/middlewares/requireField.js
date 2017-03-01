const HttpStatus = require('http-status-codes');
const R = require('ramda');

/**
 *
 */
const requireField = R.curry((type, field) =>
  function* requiredFieldValidator(next) {
    if (!this.request[type][field]) {
      this.throw(HttpStatus.BAD_REQUEST, `Required field '${field}' not found in request ${type}.`);
      return;
    }

    yield next;
  }
);

/** @module requireField */
module.exports = requireField;
