const Controllers = require('./controllers');
const Router = require('koa-router')();

Router.get('/soundcloud', Controllers.SoundCloud.index);

module.exports = Router;
