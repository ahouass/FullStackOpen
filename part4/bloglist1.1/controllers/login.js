const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const config = require('../utils/config')

loginRouter.post('/', async (request, response, next) => {
  try {
    const { username, password } = request.body

    const user = await User.findOne({ username })
    const passwordCorrect = user
      ? await bcrypt.compare(password, user.passwordHash)
      : false

    if (!user || !passwordCorrect) {
      return response.status(401).json({ error: 'invalid username or password' })
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    }

    const token = jwt.sign(userForToken, config.SECRET)

    return response.status(200).json({
      token,
      username: user.username,
      name: user.name,
    })
  } catch (error) {
    return next(error)
  }
})

module.exports = loginRouter
