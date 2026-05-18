const config = require('./utils/config')
const express = require('express')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')

const app = express()

logger.info('connecting to', config.MONGODB_URI)

mongoose
    .connect(config.MONGODB_URI, { family: 4 })
    .then(() => logger.info('connected to MongoDB'))
    .catch((error) => logger.error('error connecting to MongoDB:', error.message))

app.use(express.json())

// Routes
app.use('/api/blogs', blogsRouter)

// Middleware (order matters)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app