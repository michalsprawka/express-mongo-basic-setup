exports.getPosts = (req, res, next) => {
    res.status(200).json({
         posts: [{title: 'first post', content: 'This is first post'}]});
};

exports.createPost = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;
    res.status(201).json({
        message: "Post create success !!!",
        post: {
            id: new Date().toString(),
            title: title,
            content: content
        }
    });
};