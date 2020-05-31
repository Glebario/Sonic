const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Types = mongoose.Types

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profile: {
    userName: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: false
    },
    gender: {
      type: String,
      required: false
    },
    avatar: {
      type: String,
      required: false,
    },
    favoritePosts: [{
      type: Types.ObjectId,
      required: false
    }],
    followers: [{
      type: Types.ObjectId, ref: 'Followers',
      required: false
    }],
    subscription:[{
      type: Types.ObjectId, ref: 'Subscription',
      required: false
    }]
  }
})

module.exports = mongoose.model('users', userSchema)
