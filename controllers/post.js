const errorHandler = require('../utils/error')
const Post = require('../models/post')
const User = require('../models/user')
const fs = require('fs');


//##############################################################################
module.exports.createPost = async function(req, res) {
    try {
        const post = new Post({
            ownerUser: {
                userName: req.body.ownerUser.userName,
                avatar: req.body.ownerUser.avatar
            },
            img: req.body.img,
            message: req.body.message,
            likes: [],
            comments: [],
            owner: req.user._id
        })
        await post.save()

        const localId = req.user._id
        res.status(201).json({localId})
    } catch(e) {
        errorHandler(res, e)
    }
}
//##############################################################################
module.exports.getPost = async function(req, res) {
    try {
        const post = await Post.findById(req.params.id)
        if(post.comments) {
            await checkComment(post.comments)
        }
        await Post.findOneAndUpdate({_id: req.params.id}, post, {new: true})
        res.json(post)
    } catch(e) {
        errorHandler(res, e)
    }
}

//##############################################################################
module.exports.getFavoritePostsPreview = async function(req, res) {
    try {
        const user = await User.findById(req.user._id)
        const favoritePostId = user.profile.favoritePosts
        console.log(favoritePostId)

        const posts = await Post.find({_id: {$in : favoritePostId}})
        console.log(posts)
        const postsResponse = []

        for(let post of posts) {
            const postResponse = {
                postId: post._id,
                userId: post.owner,
                img: post.img,
                likes: post.likes ? post.likes : null,
                comments: post.comments ? post.comments.length : null
            }
            postsResponse.push(postResponse)
        }

        res.json(postsResponse)
    } catch(e) {
        errorHandler(res, e)
    }
}

//#############################################################################
module.exports.deletePost = async function(req, res) {
    try {
        const post = await Post.findById(req.params.id)
        const user = await User.findById(req.user._id)
        console.log(user)
        //+++++++++++
        const favoritePostDelete = user.profile.favoritePosts.findIndex( likePost => {
           return  likePost === post._id
        })
        console.log(favoritePostDelete)
        if(favoritePostDelete) {
            user.profile.favoritePosts.splice(favoritePostDelete, 1)
            await user.save()
        }
        fs.unlink(post.img, function(err) {
            if (err) throw err;

            console.log('file deleted');
        });
        await Post.findOneAndDelete({_id: req.params.id})
        res.json({message: 'Удалено'})
    } catch(e) {
        errorHandler(res, e)
    }
}

//#############################################################################
module.exports.updatePost = async function(req, res) {
    try {
        const post = await Post.findById(req.params.id)
        if(req.body.img !== post.img) {
            fs.unlink(post.img, function(err) {
                if (err) throw err;

                console.log('file deleted');
            });
        }

        const postUpdate = await Post.findOneAndUpdate({_id: req.params.id}, req.body, {new: true})
            res.status(201).json(postUpdate)
    } catch (e) {
        errorHandler(res, e)
    }
}

//#############################################################################
module.exports.getAllPost = async function(req, res) {
    try {
        const userOwner = await User.findById(req.user._id)
        const subscriptionOwner = userOwner.profile.subscription
        subscriptionOwner.push(req.user._id)


        const posts = await Post.find({owner: {$in : subscriptionOwner}}).sort({data: -1}).limit(10).skip(+req.params.seenPosts);
        for (const post of posts) {
            if(post.comments) {
                await checkComment(post.comments)
            }
            await checkPost(post)
        }
        res.status(200).json({posts: posts})
    } catch(e) {
        errorHandler(res, e)
    }
}

//#############################################################################
module.exports.getAllPostPreview = async function(req, res) {
    try {
        const posts = await Post.find({ owner: req.user._id })
        const postsPreview = [];
        for (const post of posts) {
            const postPreviewCreate = {
                postId: post._id,
                userId: post.owner,
                img: post.img,
                likes: post.likes ? post.likes : null,
                comments: post.comments ? post.comments.length : null
            }
            postsPreview.push(postPreviewCreate)
        }
        res.status(200).json({postsPreview})
    } catch(e) {
        errorHandler(res, e)
    }
}

//======================================================
async function checkComment(commentArray) {
    for (const comment of commentArray) {
        const user = await User.findById(comment.ownerId)
        comment.ownerName = user.profile.userName
        comment.ownerAvatar = user.profile.avatar
    }
    return commentArray
}

async function checkPost(post) {
    const user = await User.findById(post.owner)
    if(post.ownerUser.avatar !== user.profile.avatar) {
        post.ownerUser.avatar = user.profile.avatar
    }
    return post
}



