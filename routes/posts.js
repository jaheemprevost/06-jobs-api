const express = require('express');
const router = express.Router();

const {
  getAllPosts,
  getPost, 
  getMyPosts,
  createPost,
  updatePost,
  deletePost 
} = require('../controllers/posts');


router.route('/').get(getAllPosts).post(createPost);
router.route('/my-posts').get(getMyPosts);
router.route('/:id').get(getPost).patch(updatePost).delete(deletePost); 

module.exports = router;
