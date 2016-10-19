const router = require('koa-router');
const Controllers = require('../controllers');

/**
 * Middlewares
 */
const serviceValidator = require('../middlewares/serviceValidator');

/**
 * Create routes
 */
const api = router({ prefix: '/api/v1' });
const services = router({ prefix: '/services' });

/**
 * Set API routes
 */
api.get('/download', Controllers.download.get);

/**
 * Set service routes and middlewares
 */
services.use(serviceValidator);
services.get('/bandcamp', Controllers.bandcamp.get);
services.get('/soundcloud', Controllers.soundcloud.get);

/**
 * Prefix service routes to API route
 */
api.use(services.routes());

module.exports = api.routes();
