const express = require('express')
const morgan = require('morgan')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express()

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())
app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  next()
})

// 3) ROUTES
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

// [Moriah] run all http methods
app.all('*', (req, res, next) => {
  // [Moriah] Express會認為next()有接收到東西就是error，
  // 會跳過所有middldware stack，進入error handling middleware
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

// [Moriah] error handling middleware
// 只要有這4個params，Express就知道這是error handling middleware
app.use(globalErrorHandler)

module.exports = app
