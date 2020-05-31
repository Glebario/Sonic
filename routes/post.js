const express = require('express')
const controller = require('../controllers/post')
const passport = require('passport')
const router = express.Router()

router.post('', passport.authenticate('jwt', {session: false}), controller.createPost)
router.get('/:id', passport.authenticate('jwt', {session: false}), controller.getPost)
router.get('/preview/favorite/', passport.authenticate('jwt', {session: false}), controller.getFavoritePostsPreview)
router.get('/feedPosts/:seenPosts', passport.authenticate('jwt', {session: false}), controller.getAllPost)
router.get('/preview/', passport.authenticate('jwt', {session: false}), controller.getAllPostPreview)
router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.deletePost)
router.patch('/:id', passport.authenticate('jwt', {session: false}), controller.updatePost)

module.exports = router
