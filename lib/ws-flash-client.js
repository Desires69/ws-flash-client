
// @ypocat

var fs = require('fs');
var crypto = require('crypto');

function Item(path, ctype, options, next) {

	var _this = this;
	try {
		var buf = fs.readFileSync(__dirname + '/' + path);
		_this.serve = function(req, res) {
	        res.writeHead(200, {
				'Content-Type': ctype,
				'Content-Length': buf.length,
				'ETag': '"' + crypto.createHash('md5').update(buf).digest('hex') + '"',
				'Cache-Control': 'public, max-age=' + (options.devel ? 0 : 86400)
			});
	        res.end(buf);
		};
	}
	catch(err) {
		return next(err);
	}
}

module.exports = function wsFlashClient(options) {

	var options = options || {};
	var js, js2, swf;

	return function(req, res, next) {
		if('/ws-flash-client.swf' === req.url) {
			if(!swf)
				swf = new Item('../public/ws-flash-client.swf',
					'application/x-shockwave-flash', options, next);
			swf.serve(req, res);
		}
		else if('/ws-flash.js' === req.url) {
			if(!js)
				js = new Item(options.devel ? 'ws-flash.js' : '../public/ws-flash.min.js',
					'text/javascript', options, next);
			js.serve(req, res);
		}
		else if('/ws-flash-shim.js' === req.url) {
			if(!js2)
				js2 = new Item(options.devel ? 'ws-flash-shim.js' : '../public/ws-flash-shim.min.js',
					'text/javascript', options, next);
			js2.serve(req, res);
		}
		else
			next();
	};
};