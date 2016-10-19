const Router = require('koa-router')();

/**
 * Routes
 */
const api = require('./routes/api');

/**
 * Attach routes
 */
Router.use(api);

module.exports = Router;
