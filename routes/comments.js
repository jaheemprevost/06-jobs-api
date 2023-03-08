const express = require('express');
const router = express.Router();

const {
  getComments, 
  getComment, 
  createComment, 
  editComment, 
  deleteComment 
} = require('../controllers/comments'); 

router.route('/:postId/comments').get(getComments).post(createComment);
router.route('/:postId/comments/:commentId').get(getComment).patch(editComment).delete(deleteComment);

module.exports = router;
