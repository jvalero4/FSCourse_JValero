const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')

usersRouter.post('/', async (request, response) => {
  const { username, name, password, blogs } = request.body

  //We do this validation here because when the password is encrypted, its length increase
  if(password.length < 3) {
    return response.status(400).send({ error: 'Password must be at least 3 characters' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
    const users = await User
      .find({}).populate('blogs', { title: 1, url: 1, author: 1 })
    response.json(users)
  })

module.exports = usersRouter