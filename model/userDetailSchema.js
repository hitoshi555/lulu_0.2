const mongoose = require('mongoose');

const userDetailSchema = new mongoose.Schema({
  u_email: {
    type: String,
    required: [true, 'u_email is required'],
  },
  name: {
    type: String,
  },
  detail: {
    type: String,
  },
});

module.exports = mongoose.model('Detail', userDetailSchema, 'detail');