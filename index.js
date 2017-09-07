'use strict';

const restify = require('restify');
const morgan = require('morgan');
const pckg = require('./package');
const config  = require('./config').get();

const Nightmare = require('nightmare');
const get = require('lodash/get');
const isEmpty = require('lodash/isEmpty');

/*
* define cache
*/
const redis = require('redis');
let redisClient = null;

if (config.redis.enabled === true) {
  redisClient = redis.createClient({
    host: config.redis.host,
    password: config.redis.password
  });
}

const apicache = require('apicache');
const cache = apicache.options({
  redisClient
}).middleware;

const appInfo = {
  name: pckg.name,
  version: pckg.version
};

/*
* create server
*/
const server = restify.createServer({
  name: pckg.name,
  version: pckg.version
});

/*
* use plugins
*/
const { plugins } = restify;

server.pre(restify.pre.sanitizePath());

server.use(plugins.jsonBodyParser({ mapParams: true }));
server.use(plugins.acceptParser(server.acceptable));
server.use(plugins.queryParser({ mapParams: true }));
server.use(plugins.fullResponse());
server.use(morgan('short'));

/*
* define routes
*/
server.get('/', (req, res, next) => {
  res.json(appInfo);
  next();
});

server.get('/:url', cache(config.cache.duration), (req, res, next) => {
  const url = get(req, 'params.url');
  const waitForSelector = get(req, 'query.waitForSelector', 'body');

  if (isEmpty(url)) {
    res.send(500, 'url is empty');
    next();
    return;
  }

  const nightmare = Nightmare({ show: false });

  nightmare
  .goto(url)
  .wait(waitForSelector)
  .evaluate(() => document.documentElement.innerHTML)
  .end()
  .then(content => {
    res.writeHead(200, {
      'Content-Length': Buffer.byteLength(content),
      'Content-Type': 'text/html',
      'node-static-render': true
    });
    res.write(content);
    res.end();

    next();
  })
  .catch((error) => {
    res.send(500, error);
    next();
  });
});

/*
* start server
*/
server.listen(config.port, () => {
  console.log(`Listening to: ${config.port}`);
});

module.exports = server;