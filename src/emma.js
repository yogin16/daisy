var https = require('https');

var paths = ['/r/EmmaWatson.json', '/r/GetMotivated.json'];

var options = {
    host: 'www.reddit.com',
    port: 443
};

var newPhoto = function (success, error) {
    var message = {};
    var body = '';

    options.path = paths[getRandomInt(0, paths.length - 1)];

    https.get(options, function (resp) {
        resp.on('data', function (chunk) {
            body += chunk;
        }).on('end', function () {
            var json = JSON.parse(body);
            console.log("chunk.data: " + json.data);

            var children = json.data.children;
            var i;
            for (i = 0; i < children.length; i++) {
                var post = children[i].data;
                if (!post.preview) {
                    continue
                }
                message.text = post.title;
                message.permalink = "https://www.reddit.com" + post.permalink.replace('amp;', '');
                message.image = post.preview.images[0].source.url.replace('amp;', '');
                return success(message);
            }
        });
    }).on("error", function (e) {
        console.log("Got error: " + e.message);
        return error(message);
    });
};

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = newPhoto;