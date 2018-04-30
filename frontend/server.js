var path = require('path')
var express = require('express');
var fs = require('fs'); 
var app = express();



app.set('views', './views');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname,'public')));
app.get('/', function(req, res) {
  res.render('index', {
    title: 'Welcome'
  });
});

app.get('/getData', function(req, res){


});

app.listen(process.env.PORT||8000);


