var express = require('express');
var app = express()

app.use(express.static('public'));
// app.use(express.static('src'));


// respond with "hello world" when a GET request is made to the homepage
app.get('*', function (req, res) {
    res.sendFile(__dirname+'/public/index.html');
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));