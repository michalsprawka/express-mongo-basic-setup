const express = require('express');
const { body } = require('express-validator/check');
const isAuth = require('../middleware/is_auth')


const feedController = require('../controllers/feed');

const router = express.Router();

router.get('/posts',isAuth, feedController.getPosts);

router.post('/post',isAuth,[
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 5}),
], feedController.createPost);

router.get('/post/:postID', feedController.getPost);

router.put('/post/:postId',[
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 5}),
], feedController.updatePost);

router.delete('/post/:postId', feedController.deletePost)

module.exports = router;