var yt = require('youtube-js');

yt.getInfo('http://www.youtube.com/watch?v=14RFYXMXGqQ', function(info) {
	console.log('Author: ' + info.author);
	console.log('Title: ' + info.title);
	console.log('Description: ' + info.description);
	console.log('Video duration: ' + info.length_seconds + ' sec');
	console.log('Tags: ' + info.keywords.join(', '));
	console.log('Thumbnail URL: ' + info.thumbnail_url);
});