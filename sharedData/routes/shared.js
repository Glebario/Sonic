const express = require('express')
const router = express.Router()
const Shared = require('../models/sharedData')
const sharedId = require('../sharedData')
const upload = require('../../middleware/upload')
const passport = require('passport')

const cpUpload = upload.fields([{ name: 'like', maxCount: 1 }, { name: 'likeActive', maxCount: 1 }, { name: 'comment', maxCount: 1 }])
router.post('/add', cpUpload, async function (req, res) {
    const shared = new Shared({
        likeIcon: req.files['like'][0].path,
        likeActiveIcon: req.files['likeActive'][0].path,
        commentIcon: req.files['comment'][0].path
    })
    await shared.save()
    res.status(201).json(shared)
})

router.get('/getShared', async function (req, res) {
    const shared = await Shared.findById(sharedId.postSharedImg)
    res.status(200).json(shared)
})

router.post('/addFoto', passport.authenticate('jwt', {session: false}), upload.single('image'), function (req, res) {
    res.status(200).json(req.file.path)
})
module.exports = router
