const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Types = mongoose.Types

const postSchema = new Schema({
    ownerUser: {
        userName: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            required: true
        }
    },
    img: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: false
    },
    likes: [{
        type: String,
        required: false
    }],
    comments: [{
        ownerId: {
            type: Types.ObjectId,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        data: {
            type: Date,
            default: Date.now
        },
        type: Object,
        required: false
    }],
    data: {
        type: Date,
        default: Date.now
    },
    owner: {
        type: Types.ObjectId,
        ref: 'users'
    }
})

module.exports = mongoose.model('posts', postSchema)
