const { validationResult } = require('express-validator/check');
const Post = require('../models/post');
const User = require('../models/user');

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
        const error = new Error('Validation failed');
        error.statusCode = 422;
        throw error;
        // return res.status(422).json({
        //     message: 'Validation failed',
        //     errors: errors.array()
        // })
    }
    const title = req.body.title;
    const content = req.body.content;
    let creator;

    const post = new Post({
        title: title,
        content: content,
        creator: req.userId
    })
    post.save()
        .then(result => {
            return User.findById(req.userId)})
        .then(user => {
            creator = user
            user.posts.push(post)
            return user.save()
        })
        .then (result => {
            res.status(201).json({
                message: "Post create success !!!",
                post: post,
                creator: {_id: creator._id, name: creator.name}
            });
        })
            
        .catch(err => {
           if(!err.statusCode){
               err.statusCode = 500;
           }
           next(err);
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
        if(post.creator.toString() !== req.userId) {
            const error = new Error('Not authorised');
            error.statusCode = 403;
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
            if(post.creator.toString() !== req.userId) {
                const error = new Error('Not authorised');
                error.statusCode = 403;
                throw error;
            }
            return Post.findByIdAndRemove(postId)


        }
    )
    .then(result =>  {
       return  User.findById(req.userId);
        
    })
    .then(user => {
        user.posts.pull(postId);
        return user.save()
        
    })
    .then(result => {
        res.status(200).json({message: "Post deleted"})
    })
    .catch(err => print(err))
}