var express = require('express');
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

var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log('Our app listening on port 3000!');
});