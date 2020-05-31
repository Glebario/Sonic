const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const keys = require('./config/keys')
const passport = require('passport')
const morgan = require('morgan')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const postRoutes = require('./routes/post')
const sharedRoutes = require('./sharedData/routes/shared')
//const uploadRoutes = require('./uploads/uploads')
const app = express()

mongoose.connect(keys.dbUrl , {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
})
    .then(() => console.log('MongoDB connected'))
    .catch(error => console.log(error))

app.use(passport.initialize())
require('./middleware/passport')(passport)

app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))

app.use('/uploads', express.static('uploads'))

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/post', postRoutes)
app.use('/api/shared', sharedRoutes)
//app.use('/api/uploads', uploadRoutes)

module.exports = app
