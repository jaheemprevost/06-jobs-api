const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide username'],
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide a valid email'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 8, 
  }

});

userSchema.pre('save', async function() {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.createJWT = function() {
  return jwt.sign({userId: this._id, username: this.username}, process.env.JWT_SECRET, {expiresIn: process.env.EXPIRES_IN});
};

userSchema.methods.comparePassword = async function(enteredPassword) {
  const isMatch = await bcrypt.compare(enteredPassword, this.password);

  return isMatch;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
