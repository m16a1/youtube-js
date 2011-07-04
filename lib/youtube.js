/**
 * YoutubeJS
 * Copyright (c) 2011 m16a1 <a741su@gmail.com>
 * MIT Licensed
 */

var http     = require('http'),
    url      = require('url'),
    compress = require('compress'),
    Sync     = require('sync');

var formats = {
	'5' : 'flv',
	'13': '3gp',
	'17': 'mp4',
	'18': 'mp4',
	'22': 'mp4',
	'34': 'flv',
	'35': 'flv',
	'37': 'mp4',
	'38': 'mp4',
	'43': 'webm',
	'45': 'webm',
};
	
var headers = {
	'User-Agent'     : 'Mozilla/5.0 (X11; Linux x86_64; rv:5.0) Gecko/20100101 Firefox/5.0',
	'Accept-Encoding': 'gzip, deflate', //'identity',
	'Connection'     : 'close',
	'Accept'         : '*/*',
	'Accept-Language': 'en-us,en;q=0.5',
	'Accept-Charset' : 'ISO-8859-1,utf-8;q=0.7,*;q=0.7',
	'Content-type'   : 'app/xml'
};

var infoURL = 'http://www.youtube.com/get_video_info?hl=en_US&video_id=';
var elTypes = ['&el=embedded', '&el=vevo', '&el=detailpage', ''];
	
function initRequest (link, requestMethod, callbackData, callbackEnd) {
	var urlInfo = url.parse(link);
	var options = {
  		host   : urlInfo.hostname,
  		port   : urlInfo.port,
  		path   : urlInfo.pathname + urlInfo.search,
  		method : requestMethod,
  		headers: headers
	};
		
	var req = http.request(options, function (resp) {
		if (resp.statusCode == 301 || resp.statusCode == 302) {
			// redirect
			return initRequest(resp.headers.location, 'GET', callbackData, callbackEnd);
		}
		var fileSize = resp.headers['content-length'] || -1;
		resp.on('data', function (chunk) {callbackData(chunk, fileSize);});
		resp.on('end', callbackEnd);
	});
	req.end();
}
	
function getRemoteFileAsString (link, callback) {
	var data = '';
	var gunzip = new compress.Gunzip;
	
	initRequest(link, 'GET',
		function (chunk, size) {
			data += chunk.toString('binary');
		},
			
		function () {
			gunzip.init();
			decoded = gunzip.inflate(data, 'binary');
			gunzip.end();
			if (!decoded) {
				decoded = data;
			}
			
			callback(null, decoded);
		}
	);
}
	
function saveRemoteFile (link, outFile) {
	var data = '';
	var gunzip = new compress.Gunzip;
	
	initRequest(link, 'GET',
		function (chunk) {
			data += chunk.toString('binary');
		},
			
		function () {
			gunzip.init();
			decoded = gunzip.inflate(data, 'binary');
			gunzip.end();
			if (!decoded) {
				decoded = data;
			}
			
			callback(null, decoded);
		}
	);
}

function VideoInfo () {}

VideoInfo.prototype.download = function (outFile, options) {
	if (!options.resolution && !options.fmt) {
		throw 'You must determinate video resolution or format to download';
	}
};


var YoutubeJS = {};
	
YoutubeJS.getInfo = function (link, callback) {
	Sync(function () {
		
		var info = new VideoInfo();
		
		var data = getRemoteFileAsString.sync(null, link);
		
		var match = data.match(/<meta\s+property=\"og:url\"\s+content=\"http:\/\/www.youtube.com\/watch\?v=([^\"]+)\"/);
		if (!match) {
			throw 'Cannot get video id';
		}
		videoID = match[1];
		
		var match = data.match(/<meta\s+property=\"og:title\"\s+content=\"([^\"]+)\"/);
		if (!match) {
			throw 'Cannot get title';
		}
		info.title = match[1];
		
		var match = data.match(/<meta\s+property=\"og:description\"\s+content=\"([^\"]+)\"/);
		if (!match) {
			throw 'Cannot get description';
		}
		info.description = match[1];
		
		for (var i = 0; i < elTypes.length; i++) {
			data = getRemoteFileAsString.sync(null, infoURL + videoID + elTypes[i]);
			if (data) {
				break;
			}
		}

		data_arr = data.split('&');
		data_arr.forEach(function (el) {
			// var [k, v] = el.split('=');
			var k_v = el.split('=');
			var k = k_v[0], v = k_v[1];
			
			if (k == 'title') {
				return;
			}
			
			info[k] = decodeURIComponent(v);
			
		});
		
		info.keywords = info.keywords.split(',');
		
		
		var fmtMap  = info.fmt_url_map.split(',')
		    fmtList = info.fmt_list.split(',');
		    
		info.formats = {};
		fmtList.forEach(function (el) {
			//var [fmt, resolution, unknown1, unknown2, unknown3] = el.split('/');
			var _el = el.split('/');
			var fmt = _el[0], resolution = _el[1];
			info.formats[fmt] = {
				resolution: resolution,
				ext       : formats[fmt]
			};
		});
		
		fmtMap.forEach(function (el) {
			//var [fmt, location] = el.split('|');
			var _el = el.split('|');
			var fmt = _el[0], location = _el[1];
			info.formats[fmt].location = location;
		});
		
		callback(info);
	});
}

module.exports = exports = YoutubeJS;