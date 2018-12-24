const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/api/download', { target: 'http://localhost:9998/se5820' }));
};

//http://localhost:3000/api/download/SE5820_YYYYMMDDHHII_cfg.tgz