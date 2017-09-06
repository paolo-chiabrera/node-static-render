const os = require('os');

module.exports = {
  apps : [
    {
      name : 'node-static-render',
      script : 'index.js',
      instances : os.cpus().length || 2,
      exec_mode : 'cluster'
    }
  ]  
};