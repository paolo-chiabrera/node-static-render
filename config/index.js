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
      env: 'NODE_REDIS_1_PORT_6379_TCP_ADDR'
    },
    password: {
      doc: 'The redis password.',
      default: false,
      env: 'NODE_REDIS_ENV_REDIS_PASS'
    }
  },
  winston: {
    file: {
      filename: {
        doc: 'The log filename.',
        default: '/logs/pmp_fe_api.log',
        env: 'NODE_WINSTON_FILENAME'
      }
    }
  }
});

// Perform validation
conf.validate({allowed: 'strict'});

module.exports = conf;