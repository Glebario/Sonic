const errorHandler = require('../utils/error')
const User = require('../models/user')
const Post = require('../models/post')
const Shared = require('../sharedData/models/sharedData')
const sharedId = require('../sharedData/sharedData')
const fs = require('fs');

//##############################################################################
module.exports.getUser = async function(req, res) {
    try{
        const userDb = await User.findById(req.params.id)
        const posts = await Post.find({ owner: userDb._id })
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

        const userResponse = {
            user: {
                localId: userDb._id,
                profile: userDb.profile
            },
            posts: postsPreview
        }

        res.status(200).json(userResponse)
    }catch (e) {
        errorHandler(res, e)
    }
}

//#############################################################################
module.exports.deleteUser = async function(req, res) {
    try{
        await User.remove({_id: req.params.id})
        await Post.remove({owner: req.params.id})
        res.status(200).json({message: 'Удалено'})
    }catch (e) {
        errorHandler(res, e)
    }
}

//#############################################################################
module.exports.updateUser = async function(req, res) {
    const updated = {
        profile: req.body.profile
    }
    try {
        const user = await User.findById(req.params.id)
        if(updated.profile.avatar !== user.profile.avatar) {
            const avatarShared = await Shared.findById(sharedId.sharedAvatar)
            if (user.profile.avatar === avatarShared)
            fs.unlink(user.profile.avatar, function(err) {
                if (err) throw err;

                console.log('file deleted');
            });
        }
        const userUpdate = await User.findOneAndUpdate({_id: req.params.id}, updated, {new: true})
        const userResponse = {
            localId: userUpdate._id,
            profile: userUpdate.profile
        }
        res.status(201).json(userResponse)
    } catch (e) {
        errorHandler(res, e)
    }
}

//#############################################################################
module.exports.getUserFollowersPreview = async function(req, res) {
    try {
        const userOwner = await User.findById(req.user._id)
        const idFollowers = userOwner.profile.followers
        const followers = [];

        for(let id of idFollowers) {
            const followerUser = await User.findById(id)
            const followerPreview = {
                avatar: followerUser.profile.avatar,
                userName: followerUser.profile.userName,
                localId: followerUser._id
            }
            followers.push(followerPreview)
        }

        res.status(200).json({users: followers})
    }
    catch (e) {
        errorHandler(res, e)
    }
}

//#############################################################################
module.exports.getUserSubscriptionPreview = async function(req, res) {
    try {
        const userOwner = await User.findById(req.user._id)
        const idSubscription = userOwner.profile.subscription
        const subscriptions = [];

        for(let id of idSubscription) {
            const subscriptionUser = await User.findById(id)
            const subscriptionUserPreview = {
                avatar: subscriptionUser.profile.avatar,
                userName: subscriptionUser.profile.userName,
                localId: subscriptionUser._id
            }
            subscriptions.push(subscriptionUserPreview)
        }

        res.status(200).json({users: subscriptions})
    }
    catch (e) {
        errorHandler(res, e)
    }
}

//#############################################################################
module.exports.getAllUserPreview = async function(req, res) {
    try {
        console.log(req.params.seenId)
        const users = await User.find().sort({followers: -1}).limit(10).skip(+req.params.seenUsers);

        const usersPreview = []
        for(let id of users) {
            const userPreview = {
                avatar: id.profile.avatar,
                userName: id.profile.userName,
                localId: id._id
            }
            usersPreview.push(userPreview)
        }

        res.status(200).json({users: usersPreview})
    }
    catch (e) {
        errorHandler(res, e)
    }
}
