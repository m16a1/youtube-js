var yt = require('youtube-js');

yt.getInfo('http://www.youtube.com/watch?v=14RFYXMXGqQ', function(info) {

	info.download('/tmp/' + info.author + ' - ' + info.title, {fmt: 'best'});
	
});