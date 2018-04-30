const Date = require('../../models/GetData');
const Emoji = require('../../models/GetEmoji');

module.exports = (app) => {
  app.get('/api/test', (req, res, next) => {
    Date.find()
      .exec()
      .then((date) => res.json(date))
      .catch((err) => next(err));
  });

  app.get('/api/test/:date', function (req, res, next) {
    Date.find({ date: req.params.date }, {trends: 1, _id: 0})
      .exec()
      .then((data) => res.json(data))
      .catch((err) => next(err));
  });

  app.get('/api/test/:date/:trends', function (req, res, next) {
    var locationTrend = req.params.trends;
    Date.find({ date: req.params.date }, {[`locations.${locationTrend}`] : 1, _id: 0})
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
}