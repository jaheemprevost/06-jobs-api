const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, UnauthenticatedError} = require('../errors');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const user = await User.create(req.body);
  
  const token = user.createJWT();

  console.log('reach');
  console.log(token, user)
  res.status(StatusCodes.CREATED).json({user: {name: user.username}, token});
}

const login = async (req, res) => {
  const {email, password} = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please enter email and password');
  }

  const user = await User.findOne({email});
   
  if(!user) {
    throw new UnauthenticatedError('Invalid Credentials');
  }
  
  const isCorrectPassword = await user.comparePassword(password);
 
  if(!isCorrectPassword) {
    throw new UnauthenticatedError('Invalid Credentials');
  }

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({user: {name: user.username}, token});
}

module.exports = {
  register, 
  login
};
