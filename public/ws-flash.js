
// @ypocat
// jquerized, simplified, connectized
// 
// original copyright:
// 
// Copyright: Hiroshi Ichikawa <http://gimite.net/en/>
// License: New BSD License
// Reference: http://dev.w3.org/html5/websockets/
// Reference: http://tools.ietf.org/html/rfc6455


$(function() {
	
	$.extend({
		
		wsFlashClientInit: function(_options, callback) {

			var options = {
				forceFlash: false,
				logger: window.console && console.log && console.debug ?
					window.console : { log: function() {}, error: function() {} },
				swfLocation: '/ws-flash-client.swf',
				crossDomainInsecureSupport: false,
				policyFile: null,
				debug: false,
				chromeFrameFallback: true,
				swfobjectUrl: '//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js',
				shimUrl: '/ws-flash-shim.min.js',
				callback: callback
			};
			
			$.extend(options, _options || {});
			
			if(window.WebSocket && WebSocket.__initialized)
				return options.callback();
			
			if((window.WebSocket || window.MozWebSocket) && !options.forceFlash) {
				if(window.MozWebSocket)
					window.WebSocket = window.MozWebSocket;
				return options.callback();
			}

			$.getScriptCached(options.swfobjectUrl, function() {
				$.getScriptCached(options.shimUrl, function() {
					$.wsFlashInitShim(options);
				});
			});
		},
		
		getScriptCached: function(script, success) {
			$.ajax({
				url: script,
				dataType: "script",
				cache: true,
				success: success
			});
		}
		
	});
});
