const logger = require('./logger')

const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }

  next(error)
}

// const tokenExtractor = (request, response, next) => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
//     request.token = authorization.substring(7)
//   } else {
//     return response.status(401).json({ error: 'token missing' })
//   }
//   next()
// }

// const userExtractor = async (request, response, next) => {
//   const token = request.token
//   try {
//     const decodedToken = jwt.verify(token, process.env.SECRET)
//     request.user = await User.findById(decodedToken.id)
//     next()
//   } catch(err) {
//     next(err)
//   }
// }

const userExtractor = async (request, response, next) => {
  const authorization = request.get('authorization')

  let token
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    token =  authorization.substring(7)
  } else {
    return response.status(401).json({ error: 'token missing' })
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    request.user = await User.findById(decodedToken.id)
    next()
  } catch(err) {
    next(err)
  }
}

const userExtractor2 = async (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const decodedToken = jwt.verify(authorization.substring(7), process.env.SECRET)
    // err when token invalid >>> MUST HAVE try catch
    if (decodedToken) {
      request.user = await User.findById(decodedToken.id)
    }
  }

  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  // tokenExtractor,
  userExtractor,
  userExtractor2
}