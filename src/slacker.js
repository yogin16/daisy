var https = require('https');

var slacker = function (token, message) {
    var postData = JSON.stringify(message);
    console.log("postdata: " + postData);

    var options = {
        host: 'slack.com',
        path: '/api/chat.postMessage',
        port: 443,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': 'Bearer ' + token
        }
    };

    var req = https.request(options, function (res) {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);

        var body = '';
        res.on('data', function (d) {
            body += d;
        }).on('end', function () {
            console.log("body:==" + body);
        });
    });

    req.on('error', function (e) {
        console.error("error:==" + e);
    });

    req.write(postData);
    req.end();
};

module.exports = slacker;