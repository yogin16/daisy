var emma = require('./emma');
var slacker = require('./slacker');

const MongoClient = require('mongodb').MongoClient;

var emmaSlacker = function (success, error) {
    emma(function (message) {
        console.log("message: " + JSON.stringify(message));

        MongoClient.connect('mongodb://daisy:daisy@ds139919.mlab.com:39919/daisy', function (err, client) {
            if (err) {
                console.log(err);
                error({status: "mongo error"});
            }

            var db = client.db("daisy");
            var users = db.collection("user").find();
            users.forEach(function (user) {
                var slackMessage = {
                    text: message.text + " " + message.image,
                    channel: user.userId,
                    as_user: true
                };
                slacker(user.botToken, slackMessage);
            });

            success({status:"success"});
        });

    }, function () {
        console.log("error!");
        error({status:"error"});
    });
};

module.exports = emmaSlacker;