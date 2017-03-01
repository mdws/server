const router = require('koa-router');
const Controllers = require('../controllers');

/**
 * Middlewares
 */
const requireField = require('../middlewares/requireField');

/**
 * Create routes
 */
const api = router({ prefix: '/api/v1' });
const info = router({ prefix: '/info' });
const download = router({ prefix: '/download' });

/**
 * Set API routes and middlewares
 */
api.get('/export/:id', Controllers.export.get);

info.use(requireField('query', 'url'));
info.get('/bandcamp', Controllers.bandcamp.info);
info.get('/soundcloud', Controllers.soundcloud.info);
info.get('/youtube', Controllers.youtube.info);

download.post('/bandcamp', Controllers.bandcamp.download);
download.post('/soundcloud', Controllers.soundcloud.download);
download.post('/youtube', Controllers.youtube.download);

/**
 * Prefix service routes to API route
 */
api.use(info.routes());
api.use(download.routes());

module.exports = api.routes();
