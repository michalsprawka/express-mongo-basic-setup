const { validationResult } = require('express-validator/check');
const Post = require('../models/post');

exports.getPosts = (req, res, next) => {

    Post.find()
        .then(posts => {
            res.status(200)
                .json({ message: "Fetched posts succesfully", posts: posts })
        })
        .catch(err => print(err));
};

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: 'Validation failed',
            errors: errors.array()
        })
    }
    const title = req.body.title;
    const content = req.body.content;

    const post = new Post({
        title: title,
        content: content
    })
    post.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Post create success !!!",
                post: result
            });

        })
        .catch(err => {
            console.log(err);
        })


};

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
    .then(post => {
        if(!post){
            const error = new Error('Could not find post')
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message: 'Post fetched',
            post: post
        })
    })
    .catch(err => print(err))
};

exports.updatePost = (req, res,next) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: 'Validation failed',
            errors: errors.array()
        })
    }
    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    Post.findById(postId)
    .then(post => {
        if(!post){
            const error = new Error('Could not find post')
            error.statusCode = 404;
            throw error;
        }
        post.title = title;
        post.content = content;
        return post.save();

    }).then(result => {
        res.status(200).json({
            message: "Post updated", post: result
        })
    })
    .catch(err => print(err))

    
}

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
    .then(
        post => {
            //check logging user later
            if(!post){
                const error = new Error('Could not find post')
                error.statusCode = 404;
                throw error;
            }
            return Post.findByIdAndRemove(postId)


        }
    )
    .then(result =>  {
        res.status(200).json({message: "Post deleted"})
    })
    .catch(err => print(err))
}