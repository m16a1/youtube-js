var yt      = require('../lib/youtube'),
    assert  = require('assert'),
    fs      = require('fs');

var testURL = 'http://www.youtube.com/watch?v=14RFYXMXGqQ';

yt.getInfo(testURL, function(info) {
	assert.equal(info.title, 'Node.js + Socket.io = CPU activity monitor');
	assert.equal(info.description, 'Created using socket.io and nodejs using the dstat command on linux. Graphing is done by rgraph, while the nodejs is the backend and socket io is helping wit...');
	assert.equal(info.allow_ratings, '1');
	assert.equal(info.author, 'wertyuiop408');
	assert.equal(info.length_seconds, '28');
	assert.deepEqual(info.keywords, ['nodejs', 'socketio', 'socket', 'io', 'cpu', 'activity', 'monitor', 'real', 'time']);
	assert.equal(info.video_id, '14RFYXMXGqQ');
	assert.equal(info.thumbnail_url, 'http://i2.ytimg.com/vi/14RFYXMXGqQ/default.jpg');

	info.download('/tmp/' + info.author + ' - ' + info.title, {
		fmt: '5',
		onData: function (len, size) {
			console.log('downloaded ' + len + ' bytes from ' + size);
		},

		onComplete: function (file) {
			console.log('download complete');
		}
	});
	
	info.download('/tmp/testvideo', {
		fmt: 'best',
		autoext: false,

		onComplete: function (file) {
			console.log('download complete');
		}
	});
	
});