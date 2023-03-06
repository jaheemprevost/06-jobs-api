const Post = require('../models/Post'); 
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllPosts = async (req, res) => {
  const posts = await Post.find({});

  if (posts.length === 0) {
    return res.status(StatusCodes.OK).json({message: 'There are no posts. Be the first!'});
  }

  res.status(StatusCodes.OK).json({posts});
};

const getPost = async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id });

  if (!post) {
    throw new NotFoundError('Post could not be found');
  }

  res.status(StatusCodes.OK).json({post});
};

const getMyPosts = async (req, res) => { 
  const myPosts = await Post.find({createdBy: req.user.userId});

  if (myPosts.length === 0) {
    return res.status(StatusCodes.OK).json({message: 'You have no posts'});
  }

  res.status(StatusCodes.OK).json({myPosts});
};

const createPost = async (req, res) => {
  const { title, body } = req.body;
  
  if (!title || !body) {
    throw new BadRequestError('This field cannot be left blank');
  }

  req.body.createdBy = req.user.userId;

  const post = await Post.create(req.body);

  res.status(StatusCodes.CREATED).json({post});
};
 
const updatePost = async (req, res) => {
  const { title, body } = req.body;
  
  if (!title || !body) {
    throw new BadRequestError('This field cannot be left blank');
  }

  const post = await Post.findOneAndUpdate({_id: req.params.id}, {title, body}, {new: true});


  res.status(StatusCodes.OK).json({post});
};


const deletePost = async (req, res) => {
  const post = await Post.findOneAndDelete({_id: req.params.id});

  if (!post) {
    throw new NotFoundError('This post does not exist');
  }

  res.status(StatusCodes.OK).json({post});
}; 

module.exports = {
  getAllPosts,
  getPost,
  getMyPosts, 
  createPost,
  updatePost,
  deletePost 
};
