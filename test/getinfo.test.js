var yt     = require('../lib/youtube'),
    assert = require('assert');

var testURL = 'http://www.youtube.com/watch?v=F6k8lTrAE2g';

yt.getInfo(testURL, function(info) {
	assert.equal(info.title, 'Node.js: JavaScript on the Server');
	assert.equal(info.description, 'Google Tech Talk July 28, 2010 ABSTRACT Presented by Ryan Dahl, the creator of the node.JS open source project. It is well known that event loops rather than...');
	assert.equal(info.allow_ratings, '1');
	assert.equal(info.author, 'GoogleTechTalks');
	assert.equal(info.length_seconds, '3599');
	assert.deepEqual(info.keywords, ['google', 'tech', 'talk', 'javascript']);
	assert.equal(info.video_id, 'F6k8lTrAE2g');
	assert.equal(info.thumbnail_url, 'http://i3.ytimg.com/vi/F6k8lTrAE2g/default.jpg');
});