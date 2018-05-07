var path = require('path')
var express = require('express');
var fs = require('fs');
const mongoose = require('mongoose');
var util = require("util");

var spawn = require("child_process").spawn;

//Get Database connection
mongoose.connect('mongodb://34.217.144.234/tweetsdb')
console.log("hi")
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
const DateTrend = mongoose.model('DateTrend', new mongoose.Schema(), 'coll');
const Emoji = mongoose.model('Emoji', new mongoose.Schema(), 'emojiCount');
const Tweet = mongoose.model('Tweet', new mongoose.Schema(), 'filteredTweets');
const Tweets = mongoose.model('Tweets', new mongoose.Schema(), 'tweets');




var app = express();




app.set('views', './views');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname,'public')));
app.get('/', function(req, res) {
  res.render('index', {
    title: 'Welcome'
  });
});


app.get('/results', function(req, res) {
  var trend = req.query.search;
  var date = req.query.date;
  
  res.render('results', {
    title: 'Welcome',
    trend : trend,
    date : date
  });
});

app.get('/display/map', function(req, res) {
  var trend = req.query.trend;
  var date = req.query.date;
  var myArgs = process.argv.slice(2);
  if (myArgs[0]==="local"){
    //var process1 = spawn('python',[ "kafkaProducer.py", trend, date , "debug"],{ stdio: 'inherit' });
  
  }else{
    var process1 = spawn('/usr/bin/python3',[ "kafkaProducer.py", trend, date, "no"],{ stdio: 'inherit' });
  }
  res.render('map', {
    title: 'Welcome',
    trend : trend,
    date : date
  });
});

app.get('/map/:trend/:date', function (req, res, next) {
  var requestDate = req.params.date;
  var requestquery = req.params.trend;
  Tweets.find({ date: req.params.date, query :  req.params.trend, hasLocation : true}).exec().then((data) => res.json(data)).catch((err) => next(err));
});
app.get('/display/pie/:trend/:date', function(req, res) {
    res.render('pie', {
      title: 'Welcome',
      trend : req.params.trend,
      date : req.params.date
    });
  });
  app.get('/pie/:trend/:date', function (req, res, next) {
        var requestDate = req.params.date;
        var requestquery = req.params.trend;
        Tweets.aggregate([ { $match: { "date": req.params.date, "trend": req.params.trends } }, 
        { $group: { _id: "$hasLocation",count:{$sum:1} } } ]).exec().then((locations) => res.json(locations)).catch((err) => next(err));
      });


      app.get('/display/e_pie/:trend/:date', function(req, res) {
        res.render('e_pie', {
          title: 'Welcome',
          trend : req.params.trend,
          date : req.params.date
        });
      });        
      app.get('/e_pie/:trend/:date', function (req, res, next) {
            var requestDate = req.params.date;
            var requestquery = req.params.trend;
            Tweets.aggregate([ { $match: { "date": req.params.date, "trend": req.params.trends } }, 
            { $group: { _id: "$hasEmoji",count:{$sum:1} } } ]).exec().then((emojis) => res.json(emojis)).catch((err) => next(err));
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


  app.get('/api/tweets/:date/:trends', function (req, res, next) {
    var locationTrend = req.params.trends;
    console.log(req.params);
    Tweet.find({"date" : req.params.date, "trend" : " #MACSelena"},{_id : 0, "tweet": 1, "retweet_count": 1})

                      .limit(100)
      .exec()
      .then((tweets) => res.json(tweets))
      .catch((err) => next(err));
  });

  app.get('/emoji/:trends/:date', function (req, res, next) {
    var locationTrend = req.params.trends;
    console.log(req.params);
    Emoji.aggregate([ { $match: { "date": req.params.date, "trend": req.params.trends } }, 
                        { $group: { _id: "$emoji", total: { $sum: "$count"} } } ])
      .exec()
      .then((emoji) => res.json(emoji))
      .catch((err) => next(err));
  });

app.listen(process.env.PORT||8000);