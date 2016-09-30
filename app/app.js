var express = require('express');
var app = express();

app.set('view engine', 'jade');
app.set('views', 'app/views');
app.use(express.static('app/public'));

var port = process.env.PORT || 8080;

app.get('/', function (req, res) {
  res.render('index', {
    jsonRpc: process.env.WALLET_JSON_RPC,
    nameReg: process.env.WALLET_NAME_REG
  });
});

app.listen(port, function () {
  console.log('App is listening on port 8080!');
  console.log('JSON RPC: ' + process.env.WALLET_JSON_RPC);
  console.log('NameReg: ' + process.env.WALLET_NAME_REG);
});
