const Date = require('../../models/GetData');

module.exports = (app) => {
  app.get('/api/test', (req, res, next) => {
    debugger;
    console.log(req);
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
    console.log(locationTrend);
    console.log(req.params);
    Date.find({ date: req.params.date }, {[`locations.${locationTrend}`] : 1, _id: 0})
      .exec()
      .then((locations) => res.json(locations))
      .catch((err) => next(err));
  });
}