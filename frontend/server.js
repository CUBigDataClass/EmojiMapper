var path = require('path')
var express = require('express');
var fs = require('fs'); 
const mongoose = require('mongoose');

//Get Database connection


var app = express();




app.set('views', './views');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname,'public')));
app.get('/', function(req, res) {
  res.render('index', {
    title: 'Welcome'
  });
});
app.get('/api/r_index', (req, res, next) => {
  	mongoose.connect('mongodb://34.217.144.234/tweetsdb')
  	console.log("hi")
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	const DateTrend = mongoose.model('DateTrend', new mongoose.Schema(), 'coll');

    DateTrend.find()
      .exec()
      .then((date) => res.json(date))
      .catch((err) => next(err));
});
app.get('/api/r_index/:date', function (req, res, next) {
  	mongoose.connect('mongodb://34.217.144.234/tweetsdb')
  	console.log("hi1")
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	const DateTrend = mongoose.model('DateTrend', new mongoose.Schema(), 'coll');

    DateTrend.find({ date: req.params.date }, {trends: 1, _id: 0})
      .exec()
      .then((data) => res.json(data))
      .catch((err) => next(err));
  });

  app.get('/api/r_index/:date/:trends', function (req, res, next) {
  	mongoose.connect('mongodb://34.217.144.234/tweetsdb')
  	console.log("hi1")
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	const DateTrend = mongoose.model('DateTrend', new mongoose.Schema(), 'coll');
    var locationTrend = req.params.trends;
    DateTrend.find({ date: req.params.date }, {[`locations.${locationTrend}`] : 1, _id: 0})
      .exec()
      .then((locations) => res.json(locations))
      .catch((err) => next(err));
  });

  app.get('/api/emoji/:date/:trends', function (req, res, next) {
  	mongoose.connect('mongodb://34.217.144.234/tweetsdb')
  	console.log("hi1")
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	const DateTrend = mongoose.model('DateTrend', new mongoose.Schema(), 'emojiCount');
  	const Emoji = mongoose.model('Emoji', new mongoose.Schema(), 'emojiCount');
    var locationTrend = req.params.trends;
    console.log(req.params);
    Emoji.aggregate([ { $match: { "date": req.params.date, "trend": req.params.trends } }, 
                        { $group: { _id: "$emoji", total: { $sum: "$count"} } } ])
      .exec()
      .then((emoji) => res.json(emoji))
      .catch((err) => next(err));
  });


  app.get('/api/tweets/:date/:trends', function (req, res, next) {
  	mongoose.connect('mongodb://34.217.144.234/tweetsdb')
  	console.log("hi1")
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	const DateTrend = mongoose.model('DateTrend', new mongoose.Schema(), 'filteredTweets');
  	const Tweet = mongoose.model('Tweet', new mongoose.Schema(), 'filteredTweets');
    var locationTrend = req.params.trends;
    console.log(req.params);
    Tweet.find({"date" : req.params.date, "trend" : req.params.trends},{_id : 0, "tweet": 1})
                  .sort({"retweet_count": -1})
                      .limit(10)
      .exec()
      .then((tweets) => res.json(tweets))
      .catch((err) => next(err));
  });

app.listen(process.env.PORT||8000);


