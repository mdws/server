const koa = require('koa');
const Config = require('./config');
const Router = require('./app/router');
const SoundCloud = require('./lib/soundcloud');

/**
 * Initialize application
 */
const app = koa();

/**
 * Set environment
 */
app.env = Config.app.env;

/**
 * Set routes
 */
app.use(Router.routes());

/**
 * Set error handler
 */
app.on('error', console.error);

/**
 * Get required data for application context
 */
Promise.all([
  SoundCloud.getConfig(),
]).then(([ soundcloud ]) => {
  /**
   * Set services configuration
   */
  app.context.services = {
    soundcloud,
  };

  /**
   * Start server
   */
  app.listen(Config.app.port, () => {
    console.log(`Server listening on port ${Config.app.port}`);
  });
}).catch(console.error);
