const express = require('express')
const controller = require('../controllers/user')
const passport = require('passport')
const router = express.Router()

router.get('/userId/:id', passport.authenticate('jwt', {session: false}), controller.getUser)
router.get('/followers', passport.authenticate('jwt', {session: false}), controller.getUserFollowersPreview)
router.get('/subscription', passport.authenticate('jwt', {session: false}), controller.getUserSubscriptionPreview)
router.get('/allUsers/:seenUsers', passport.authenticate('jwt', {session: false}), controller.getAllUserPreview)
router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.deleteUser)
router.patch('/:id', passport.authenticate('jwt', {session: false}), controller.updateUser)

module.exports = router
