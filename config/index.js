'use strict';

const convict = require('convict');

// Define a schema
const conf = convict({
  cache: {
    duration: {
      doc: 'The cache duration.',
      default: 3600000,
      env: 'CACHE_DURATION'
    }
  },
  env: {
    doc: 'The applicaton environment.',
    format: ['production', 'development', 'test', 'local'],
    default: 'development',
    env: 'NODE_ENV'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 9000,
    env: 'PORT'
  },
  redis: {
    enabled: {
      doc: 'The redis flag.',
      default: false,
      env: 'NODE_REDIS_ENABLED'
    },
    host: {
      doc: 'The redis host.',
      default: '192.168.99.100',
      env: 'NODE_REDIS_HOST'
    },
    password: {
      doc: 'The redis password.',
      default: false,
      env: 'NODE_REDIS_PASS'
    }
  }
});

// Perform validation
conf.validate({allowed: 'strict'});

module.exports = conf;