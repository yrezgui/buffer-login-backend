var request     = require('request');
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var querystring = require('querystring');

var port              = process.env.PORT || 1337;
var BUFFER_OAUTH_URI  = 'https://api.bufferapp.com/1/oauth2/token.json';

app.use(bodyParser());

app.post('/', function (req, res) {
  if(!req.body.code) {
    res.send(400, {error: 'No authentification found'});
  }

  var code = querystring.unescape(req.body.code);

  var data = {
    client_id: process.env.BUFFER_CLIENT_ID,
    client_secret: process.env.BUFFER_CLIENT_SECRET,
    redirect_uri: process.env.BUFFER_REDIRECT_URI,
    code: code,
    grant_type: 'authorization_code'
  };

  console.log(data);

  return request({
    url: BUFFER_OAUTH_URI,
    method: 'POST',
    form: data
  }).pipe(res);
});

var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});