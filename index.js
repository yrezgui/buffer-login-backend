var request     = require('request');
var express     = require('express');
var oauthApp    = express();
var corsApp     = express();
var bodyParser  = require('body-parser');
var querystring = require('querystring');

var OAUTH_PORT        = process.env.OAUTH_PORT || 1337;
var CORS_PORT         = process.env.CORS_PORT || 9292;
var BUFFER_OAUTH_URI  = 'https://api.bufferapp.com/1/oauth2/token.json';

oauthApp.use(bodyParser());

oauthApp.post('/', function post(req, res) {
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

  return request({
    url: BUFFER_OAUTH_URI,
    method: 'POST',
    form: data
  }).pipe(res);
});

oauthApp.listen(OAUTH_PORT, function listen() {
    console.log('oauthApp listening on port %d', OAUTH_PORT);
});

corsApp.all('*', function all(req, res) {

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');

  return request({
    url: req.path.slice(1),
    method: req.method,
    qs: req.query,
    form: req.body
  }).pipe(res);
});

corsApp.listen(CORS_PORT, function listen() {
    console.log('corsApp listening on port %d', CORS_PORT);
});

