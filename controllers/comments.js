const Comment = require('../models/Comment');
const Post = require ('../models/Post');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, NotFoundError} = require('../errors');

const getComments = async (req, res) => {
  const postId = req.params.postId;

  const post = await Post.find({_id: postId});

  if (post.length === 0) {
    throw new NotFoundError('This post does not exist.');
  }

  const commentsData = await Comment.find({post: postId}).populate('madeBy').sort('madeBy'); 
  
  if (commentsData.length === 0) {
    return res.status(StatusCodes.OK).json({message: 'Be the first to comment'});
  }
  const comments = commentsData.map(document => {
    const comment = {
      text: document.text,
      madeBy: document.madeBy.username,
      id: document._id
    };

    return comment;
  });
  res.status(StatusCodes.OK).json({comments});
};

const getComment = async (req, res) => {
  const {
    params: {postId, commentId} 
  } = req;

  const post = await Post.find({_id: postId});

  if (post.length === 0) {
    throw new NotFoundError('This post does not exist.');
  }
   
  const comment = await Comment.find({_id: commentId}); 
  
  if (!comment) {
    throw new NotFoundError('This comment could not be found');
  }

  res.status(StatusCodes.OK).json({comment});
};

const  createComment = async (req, res) => {  
  const { 
    user: {userId},
    body: {text},
    params: {postId} 
  } = req;

  if (!text) {
    throw new BadRequestError('Please provide comment text');
  }
 
  const parentPost = await Post.find({_id: postId});

  if (!parentPost) {
    throw new NotFoundError('This post does not exist.');
  } 

  const comment = await Comment.create({text, madeBy: userId, post: postId}); 

  res.status(StatusCodes.CREATED).json({comment});
}

const editComment = async (req, res) => {
  const {
    user: {userId},
    body: {text},
    params: {commentId} 
  } = req;

  if (!text) {
    throw new BadRequestError('Please provide comment text');
  } 

  const comment = await Comment.findOneAndUpdate({_id: commentId, madeBy: userId}, {text}, {new: true, runValidators: true});

  if(!comment) {
    throw new NotFoundError('This comment does not exist');
  }

  res.status(StatusCodes.OK).json({comment});
};

const deleteComment = async (req, res) => {
  const {
    user: {userId},
    params: {commentId} 
  } = req;
 
  const comment = await Comment.findOneAndDelete({_id: commentId, madeBy: userId});

  if(!comment) {
    throw new NotFoundError('This comment does not exist');
  }

  res.status(StatusCodes.OK).json({comment});
};

module.exports = {
  getComments,
  getComment,
  createComment,
  editComment,
  deleteComment
};
