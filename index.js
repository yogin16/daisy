var express = require('express');
var https = require('https');
var app = express();

var emma = require('./src/emma');

app.get('/emma', function (req, res) {
    emma(function (message) {
        console.log("message: " + JSON.stringify(message));
        res.json(message);
    }, function () {
        console.log("error!");
        res.error();
    });
});

app.get('/slack/oauth/callback', function (req, res) {
    var code = req.param('code');
    console.log("code: " + code);

    var clientId = "236598299521.236473740880";
    var clientSecret = "39c58f620583a4c8998d9e09c10a213c";

    var options = {
        host: 'slack.com',
        port: 443,
        path: '/api/oauth.access?client_id=' + clientId + '&client_secret=' + clientSecret + '&grant_type=authorization_code&code=' + code
    };

    https.get(options, function (resp) {
        var body = '';
        resp.on('data', function (chunk) {
            body += chunk;
        }).on('end', function () {
            console.log("body:" + body);
            var json = JSON.parse(body);

            res.json({status:"ok"});
        }).on('error', function () {
            res.json({status:"error"});
        })
    })
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log('Our app listening on port 3000!');
});