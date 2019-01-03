const proxy = require('http-proxy-middleware');
//https://github.com/chimurai/http-proxy-middleware
const options = {
	target : 'http://localhost:9998',
	pathRewrite : {
		'^/api/download' : '/se5820/api/download',
		'^/usb' : '/_tmp',
		'^/sd' : '/_tmp'
	}
};

module.exports = function(app) {
  // app.use(proxy('/api/download', { target: 'http://localhost:9998/se5820' }));
  app.use(['/api/**', '/usb/**', '/sd/**'],proxy(options));
};

//http://localhost:3000/api/download/SE5820_YYYYMMDDHHII_cfg.tgz