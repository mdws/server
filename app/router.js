const Controllers = require('./controllers');
const Router = require('koa-router')();

Router.get('/soundcloud', Controllers.SoundCloud.index);
Router.get('/bandcamp', Controllers.Bandcamp.index);

module.exports = Router;
