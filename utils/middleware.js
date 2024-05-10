const {infoMessage,errorMessage} = require('./logger')

const requestLogger = (request, response, next) => {
  infoMessage('Method:', request.method)
  infoMessage('Path:  ', request.path)
  infoMessage('Body:  ', request.body)
  infoMessage('---')
  next()
}

const errorHandler = (error, request, response, next) => {
    errorMessage(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
      return response.status(400).json({ error: 'expected `username` to be unique' })
    }
    
    next(error)
  }

module.exports = {
    errorHandler,
    requestLogger
}