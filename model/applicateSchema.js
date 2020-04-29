const mongoose = require('mongoose');

const applicateSchema = new mongoose.Schema({
  p_id: {
    type: String,
    required: [true, 'p_id is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
  },
});

module.exports = mongoose.model('Applicate', applicateSchema, 'applicate');