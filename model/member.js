const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  community: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    unique: true,
  },
  role: {
    type: String, 
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },

});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;
