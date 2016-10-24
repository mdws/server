const koa = require('koa');
const koaBunyanLogger = require('koa-bunyan-logger');

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
 * Set loggers
 */
app.use(koaBunyanLogger({
  streams: [
    {
      level: 'info',
      type: 'rotating-file',
      path: 'logs/all.log',
      period: '1d',
      count: 7,
    },
    {
      level: 'error',
      type: 'rotating-file',
      path: 'logs/error.log',
      period: '1d',
      count: 7,
    },
  ],
}));

app.use(koaBunyanLogger.requestLogger());

/**
 * Disable default error handler
 */
app.on('error', () => {});

/**
 * Set routes
 */
app.use(Router.routes());

/**
 * Get required data for application context
 */
SoundCloud.getConfig().then((soundcloud) => {
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
