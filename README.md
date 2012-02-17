## ws-flash-client: gimite's [WebSocket](https://github.com/gimite/web-socket-js) Flash client shim adapted as Connect [middleware](https://github.com/senchalabs/connect) for easy usage in Node.js' [Express](http://expressjs.com/) framework, to be used with einaros' [ws](https://github.com/einaros/ws) WebSocket server

### Why

* 99% of WebSocket use cases currently can be covered with just 2 transports: the WebSocket itself, or Adobe Flash client talking through the WebSocket protocol.

* [socket.io](http://socket.io), the Node.js' most prominent WebSocket framework supporting multiple transports, has currently about ~160 open issues and ~600 closed issues, suggesting that the problem area it tries to solve may be scoped too wide. (Just supporting all the WebSocket protocol flavors is a big undertaking, now add cross-browser support for multiple alternative transports and a lot of framework functionality on top of that = easily a very complex project.)

### Except

The only two areas which could probably use an additional bidirectional transport type:

* some Android browsers without Adobe Flash (see the support [here](http://socialcompare.com/en/comparison/android-versions-comparison) and [here](http://www.adobe.com/flashplatform/certified_devices/smartphones.html)), however those users still have a choice to install an alternative browser, e.g. Firefox Mobile, or the Chrome for Android which is currently in beta, and get the native WebSocket support.
* iOS versions older than 4.2 (released on 10/2010), however these seem to make up [less than 10%](http://www.quora.com/What-is-the-version-share-of-iOS-today%E2%80%94iOS5-iOS4*) of all iOS versions in use.

### Also

On the desktop on IE and Opera without Flash installed (~0.1% of users), the following is available:

* IE9 and lower can install [Google Frame](http://code.google.com/chrome/chromeframe/). IE10 due in Q3/2012 will support WebSocket.
* Opera 11 users can enable WebSocket by pasting "opera:config#Enable%20WebSockets" into the address bar, pressing ENTER and changing the setting.

### Thus

Perhaps having lean and mean [pure-WebSocket](https://github.com/einaros/ws) server (with good WebSocket protocol versions support) and making sure the client can use one of the WebSocket protocols to talk to it (natively or with the help of Adobe Flash), just may be the way to go these Wild-West days.

### Briefly Tested On

* Google Chrome 17 Mac, 16, 17 Win
* Firefox 7 Mac, 10 Win
* Internet Explorer 6, 7, 8, 9 on Win XP and Win 7 (Flash)
* Safari 5.1 Win, 5 Mac
* Opera 9.8 Win (Flash)
* Chrome Beta on Android 4.0, Galaxy Nexus
* Mobile Safari on iOS 5.0.1, iPhone 3GS

### Usage

On command line:

	npm install express
	npm install ws
	npm install ws-flash-client
	npm install policyfile
	
In your main script.js:

```js
var prod = process.env.NODE_ENV === 'production;
var app = require('express').createServer();
var wss = new (require('ws').Server)({ server: app });
var wsflash = require('ws-flash-client');
require('policyfile').createServer().listen(prod ? 843 : 10843, app);

app.configure(function() {

	// ..configure other stuff like express globals, jade, stylus, etc..

	// configure the ws-flash-client middleware:
	app.use(wsflash.wsFlashClient());	

	// static file handling must come afterwards:
	app.use(express.static(pub));

	app.listen(prod ? 80 : 1234);

	// example action for your websocket server:
	wss.on('connection', function(ws) {
		ws.send(JSON.stringify({ msg: 'hello world' }));
	});
	
});
```

In your HTML page ([JADE](http://jade-lang.com/) syntax shown):

	!!! 5
	html
		head
			meta(http-equiv='X-UA-Compatible', content='IE=Edge,chrome=1')
			//if lt IE 8
				script(src='http://yandex.st/json2/2011-10-19/json2.min.js')
			script(src='http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js')
			script(src='/ws-flash.js')
			script(src='/myclientcode.js')
		body
			#msg

In your clientcode.js:

```js
$(function() {

	$.wsFlashClientInit({}, function(err) {
		
		if(err)
			return $('#msg').text('no websocket for old men');


		// and off you go:
		
		var ws = new window.WebSocket('ws://' + window.location.host + '/');

		ws.onmessage = function(e) {
			$('#msg').text(JSON.parse(e.data).msg);
		};
		
	});

});
```

Note: the necessity of callback is a bit ugly, but thanks to it, the browsers with native WebSocket support only see about 800 bytes of overhead in 1 request (instead of loading the full shim code plus swfobject.js on each request, which is about 22kB in 2 requests, so even if cached it's still an overhead for us minimalists). To clarify, it's possible to load the scripts synchronously, but only from the same domain, and for the purpose of this library (while not using Ender), and also in general sense of lean web apps, it's good to have the option of the CDN-hosted scripts. (Huh.)

Additional options for `$.wsFlashClientInit(options, callback)`:

```js
{
	chromeFrameFallback: true,
		// In the IE, if both the native WebSocket and Adobe Flash are missing, offer to install Chrome Frame.

	forceFlash: false,
		// Force the use of the Flash shim even if native WebSocket is available.

	swfLocation: '/ws-flash-client.swf',
		// Overridable location of the Flash SWF file.

	policyFile: null,
		// Allows to specify an alternate Flash policy file location.
		// See: http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/system/Security.html#loadPolicyFile(%29

	crossDomainInsecureSupport: false,
		// calls Security.allowDomain("*") and Security.allowInsecureDomain("*") in the Flash file
		// See: http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/system/Security.html#allowDomain(%29
		// See: http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/system/Security.html#allowInsecureDomain(%29

	debug: false,
		// Make the Flash say things.

	logger: { log: function(msg) {}, error: function(msg) {} },
		// Overridable logger, defaults to console.log and console.error, if available, or to empty functions if not.

	swfobjectUrl: 'http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js'
		// Where to load swfobject.js from.
}
```

### //TODO

* Testing! (Not much time for this though. Fill Issues, send Pull Requests.)
* Add Ender support.

### License

New BSD License.
