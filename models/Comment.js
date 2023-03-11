const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please provide comment'],
    minlength: 4,
    maxlength: 200
  },
  madeBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user']
  },
  post: {
    type: mongoose.Types.ObjectId, 
    ref: 'Post',
    required: [true, 'Please provide post']
  }
}, {timestamps: true});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
