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

  const commentsData = await Comment.find({post: postId}).populate('madeBy'); 
  
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
  const post = await Post.find({_id: req.body.post});

  if (post.length === 0) {
    throw new NotFoundError('This post does not exist.');
  }
  
  const commentId = req.params.commentId;
  const comment = await Comment.find({_id: commentId}); 
  
  if (!comment) {
    throw new NotFoundError('This comment could not be found');
  }

  res.status(StatusCodes.OK).json({comment});
};

const  createComment = async (req, res) => { 
  if (!req.body.text) {
    throw new BadRequestError('Please provide comment text');
  }

  req.body.madeBy = req.user.userId; 
  req.body.post = req.params.postId; 

  const post = await Post.find({_id: req.body.post});

  if (post.length === 0) {
    throw new NotFoundError('This post does not exist.');
  }

  const comment = await Comment.create(req.body); 

  res.status(StatusCodes.CREATED).json({comment});
}

const editComment = async (req, res) => {
  if (!req.body.text) {
    throw new BadRequestError('Please provide comment text');
  }

  const commentId = req.params.commentId;

  const comment = await Comment.findOneAndUpdate({_id: commentId}, {text: req.body.text}, {new: true});

  if(!comment) {
    throw new NotFoundError('This comment does not exist');
  }

  res.status(StatusCodes.OK).json({comment});
};

const deleteComment = async (req, res) => {
  const commentId = req.params.commentId;
  const comment = await Comment.findOneAndDelete({_id: commentId});

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
