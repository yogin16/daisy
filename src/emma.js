var https = require('https');

var options = {
    host: 'www.reddit.com',
    port: 443,
    path: '/r/EmmaWatson.json'
};

var newPhoto = function (success, error) {
    var message = {};
    var body = '';
    https.get(options, function (resp) {
        resp.on('data', function (chunk) {
            body += chunk;
        }).on('end', function () {
            var json = JSON.parse(body);
            console.log("chunk.data: " + json.data);

            var post = json.data.children[0].data;
            message.text = post.title;
            message.permalink = "https://www.reddit.com" + post.permalink.replace('amp;', '');
            message.image = post.preview.images[0].source.url.replace('amp;', '');
            return success(message);
        });
    }).on("error", function (e) {
        console.log("Got error: " + e.message);
        return error(message);
    });
};

module.exports = newPhoto;