const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const mongoose = require('mongoose')
const config = require('./utils/config')
const {infoMessage,errorMessage} = require('./utils/logger') 
const middleware = require('./utils/middleware')

mongoose.set('strictQuery', false)

infoMessage('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    infoMessage('connected to MongoDB')
  })
  .catch((error) => {
    errorMessage('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(middleware.requestLogger)
app.use(middleware.errorHandler)


module.exports = app