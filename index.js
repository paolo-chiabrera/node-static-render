'use strict';

const restify = require('restify');
const morgan = require('morgan');
const pckg = require('./package');
const config  = require('./config').get();

const Nightmare = require('nightmare');

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
  const url = req.header('static-render-url');
  const selector = req.header('static-render-selector', 'body');
  
  if (url) {
    getContent(url, selector, res, next);
    return;
  }

  res.json(appInfo);
  next();
});

function getContent(url, selector, res, next) {
  const nightmare = Nightmare({ show: false });

  nightmare
  .goto(url)
  .wait(selector)
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
}

/*
* start server
*/
server.listen(config.port, () => {
  console.log(`Listening to: ${config.port}`);
});

module.exports = server;