const mongoose = require('mongoose');
module.exports = mongoose.model('Emoji', new mongoose.Schema(), 'emojiCount');