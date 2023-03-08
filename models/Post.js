const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter a title'],
    minlength: 4,
    maxlength: 130
  },
  body: {
    type: String,
    required: [true, 'Please enter body text'],
    minlength: 10,
    maxlength: 300
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user']
  },
  status: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  }

}, {timestamps: true});


const Post = mongoose.model('Post', postSchema);

module.exports = Post;
