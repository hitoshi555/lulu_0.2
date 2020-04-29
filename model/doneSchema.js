const mongoose = require('mongoose');

const doneSchema = new mongoose.Schema({
  p_id: {
    type: String,
    required: [true, 'p_id is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
  },
  flag: {
    type: Boolean,
    required: [true, 'flag is required'],
  },
});

module.exports = mongoose.model('Done', doneSchema, 'done');