const User = require('../models/user')
const Shared = require('../sharedData/models/sharedData')
const bcrypt = require('bcrypt-nodejs')
const jwt = require('jsonwebtoken')
const sharedId = require('../sharedData/sharedData')
const {validationResult} = require('express-validator')
const error = require('../utils/error')
const keys = require('../config/keys')

module.exports.login = async function(req, res) {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные при регистрации'
            })
        }

        const candidate = await User.findOne({email: req.body.email})

        if (candidate) {
            const result = bcrypt.compareSync(req.body.password, candidate.password)
            if (result) {
                const userResponse = {
                    localId: candidate._id,
                    profile: candidate.profile
                }
                const token = jwt.sign({
                    email: candidate.email,
                    userId: candidate._id
                }, keys.jwt, {expiresIn: 60 * 60})
                res.status(200).json({
                    token: `Bearer ${token}`,
                    userResponse
                })
            } else {
                res.status(401).json({message: 'Пароль неверный'})
            }
        } else {
            res.status(404).json({message: 'Пользователь не найден'})
        }
    } catch(e) {
        error(res, e)
    }
}






module.exports.register = async function(req, res) {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные при регистрации'
            })
        }


        const emailCandidate = await User.findOne({email: req.body.email})
        if (emailCandidate) {
            res.status(409).json({message: 'Такой email уже занят'})
        } else {
            const sharedData = await Shared.findById(sharedId.sharedAvatar)
            req.body.profile.avatar = sharedData.avatarIcon
            const salt = bcrypt.genSaltSync(10)
            const userDb = new User({
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, salt),
                profile: req.body.profile
            })

            await userDb.save()
            const newUserServer = await User.findOne({email: req.body.email})
            const userResponse = {
                localId: newUserServer._id,
                profile: newUserServer.profile
            }
            const token = jwt.sign({
                email: newUserServer.email,
                userId: newUserServer._id
            }, keys.jwt, {expiresIn: 60 * 60})
            res.status(201).json({
                token: `Bearer ${token}`,
                userResponse
            })
        }
    } catch(e) {
        error(res, e)
    }
}
