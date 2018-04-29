const mongoose = require('mongoose');

module.exports = mongoose.model('Date', new mongoose.Schema(), 'coll');