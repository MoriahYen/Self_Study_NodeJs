const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // [Moriaj] http requst紀錄日誌
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100, // [Moriah] 1hr from the same ip
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize()); // [Moriah] 過濾$等符號

// Data sanitization against XSS
app.use(xss()); // [Moriah] clean所有用戶輸入的惡意html code

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// [Moriah] run all http methods
app.all('*', (req, res, next) => {
  // [Moriah] Express會認為next()有接收到東西就是error，
  // 會跳過所有middldware stack，進入error handling middleware
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// [Moriah] error handling middleware
// 只要有這4個params，Express就知道這是error handling middleware
app.use(globalErrorHandler);

module.exports = app;
