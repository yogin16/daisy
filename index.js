var express = require('express');
var app = express();

var emma = require('./src/emma');

app.get('/emma', function (req, res) {
    emma(function (message) {
        console.log("message: " + JSON.stringify(message));
    }, function () {
        console.log("error!");
    });
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log('Our app listening on port 3000!');
});