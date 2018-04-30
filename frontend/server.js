var path = require('path')
var express = require('express');
var fs = require('fs'); 
const mongoose = require('mongoose');

//Get Database connection
mongoose.connect('mongodb://52.34.5.62:27017/revidx')

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


const Emoji = mongoose.model('Emoji', new mongoose.Schema(), 'emojiCount');


var app = express();




app.set('views', './views');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname,'public')));
app.get('/', function(req, res) {
  res.render('index', {
    title: 'Welcome'
  });
});


  app.get('/api/test', (req, res, next) => {
  	mongoose.connect('mongodb://52.34.5.62:27017/revidx')
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	const DateTrend = mongoose.model('DateTrend', new mongoose.Schema(), 'coll');

    DateTrend.find()
      .exec()
      .then((date) => res.json(date))
      .catch((err) => next(err));
  });

  app.get('/api/test/:date', function (req, res, next) {
    DateTrend.find({ date: req.params.date }, {trends: 1, _id: 0})
      .exec()
      .then((data) => res.json(data))
      .catch((err) => next(err));
  });

  app.get('/api/test/:date/:trends', function (req, res, next) {
    var locationTrend = req.params.trends;
    DateTrend.find({ date: req.params.date }, {[`locations.${locationTrend}`] : 1, _id: 0})
      .exec()
      .then((locations) => res.json(locations))
      .catch((err) => next(err));
  });

  app.get('/api/emoji/:date/:trends', function (req, res, next) {
    var locationTrend = req.params.trends;
    console.log(req.params);
    Emoji.aggregate([ { $match: { "date": req.params.date, "trend": req.params.trends } }, 
                        { $group: { _id: "$emoji", total: { $sum: "$count"} } } ])
      .exec()
      .then((emoji) => res.json(emoji))
      .catch((err) => next(err));
  });



app.listen(process.env.PORT||8000);


