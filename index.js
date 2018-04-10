var express = require('express');
var https = require('https');
var app = express();

var emma = require('./src/emma');
var slacker = require('./src/slacker');
var emmaSlacker = require('./src/emmaSlacker');

const MongoClient = require('mongodb').MongoClient;

app.get('/emma', function (req, res) {
    emma(function (message) {
        console.log("message: " + JSON.stringify(message));
        res.json(message);
    }, function () {
        console.log("error!");
        res.error();
    });
});

app.get('/emma/slacker', function (req, res) {
    emmaSlacker(function (message) {
        res.json(message);
    }, function (err) {
        res.error(err);
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

            var user = {};
            user.accessToken = json.access_token;
            user.userId = json.user_id;
            user.teamName = json.team_name;
            user.teamId = json.team_id;
            user.botUserId = json.bot.bot_user_id;
            user.botToken = json.bot.bot_access_token;

            MongoClient.connect('mongodb://daisy:daisy@ds139919.mlab.com:39919/daisy', function (err, client) {
                if (err) {
                    console.log(err);
                    res.json({status:"mongo error"});
                }

                var db = client.db("daisy");
                db.collection("user").insertOne(user);
            });

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