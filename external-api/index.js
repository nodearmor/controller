const express = require('express')
const initPassport = require('./passport')
const user = require('./controllers/user')

const router = express.Router()

initPassport(router)

router.use('/user', user)

module.exports = router
