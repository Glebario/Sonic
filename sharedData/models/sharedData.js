const mongoose = require('mongoose')
const Schema = mongoose.Schema

const sharedSchema = new Schema({
    likeIcon: {
        type: String,
        required: false
    },
    likeActiveIcon: {
        type: String,
        required: false
    },
    commentIcon: {
        type: String,
        required: false
    },
    avatarIcon: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model('shareds', sharedSchema)
