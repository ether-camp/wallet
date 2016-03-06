var express = require('express');
var app = express();

app.set('view engine', 'jade');
app.set('views', 'app/views');
app.use(express.static('app/public'));


app.get('/', function (req, res) {
  res.render('index', {
    jsonRpc: process.env.WALLET_JSON_RPC,
    nameReg: process.env.WALLET_NAME_REG
  });
});

app.listen(8080, function () {
  console.log('App is listening on port 8080!');
});
