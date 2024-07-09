const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));
// Set security HTTP headers

// [Moriah] 自己加的，跟chrome security有關
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  })
);
//app.use(helmet());

app.use(function(req, res, next) {
  res.setHeader('Content-Security-Policy', "script-src 'self' api.mapbox.com");
  return next();
});

app.use(function(req, res, next) {
  res.setHeader(
    'Content-Security-Policy',
    "script-src 'self' cdnjs.cloudflare.com"
  );
  return next();
});

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // [Moriaj] http requst紀錄日誌
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // [Moriah] 1hr from the same ip
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// [Moriah] 過濾$等符號，ex: "email": {"gt": ""}

// Data sanitization against XSS
app.use(xss()); // [Moriah] clean所有用戶輸入的惡意html code

// Prevent parameter pollution
// [Moriah] 不太懂
app.use(
  hpp({
    whitelist: [
      // [Moriah] whitelist: 允許在查詢字串中重複查詢，ex: 兩個duration
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

// 3) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

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
