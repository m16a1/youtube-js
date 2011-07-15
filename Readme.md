## Examples

	var yt = require('../lib/youtube');

	yt.getInfo('http://www.youtube.com/watch?v=F6k8lTrAE2g', function(info) {
		info.download('/tmp/' + info.author + ' - ' + info.title, {
			fmt: '5',
			onData: function (len, size) {
			    console.log('downloaded ' + len + ' bytes from ' + size);
			},
		
			onComplete: function (file) {
			    console.log('download complete');
			}
		});
		
	});

## Requirements

* compress.
* sync.