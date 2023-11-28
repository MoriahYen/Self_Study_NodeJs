const fs = require('fs')
const express = require('express');
// const morgan = require('morgan');

// const tourRouter = require('./routes/tourRoutes');
// const userRouter = require('./routes/userRoutes');

const app = express();

// app.use(express.json()) // [Moriah] middleware: 一個可以修改傳入請求數據的功能

// app.get('/', (req, res) => {
//   res.status(200).json({message: 'Hello from server.', app: 'natours'})
// })

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint...')
// })
const tours /* x */ = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours /* x */
    }
  })
})

app.post('/api/v1/tours', (req, res) => {
 // console.log(req.body)
  
  const newId = tours[tours.length - 1].id + 1
  const newTour = Object.assign({id: newId}, req.body)  // [Moriah]: assign>>將兩個obj合成一個新的obj

  tours.push(newTour)
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    })
  })
})

const port = 3000
app.listen(port, () => {
  console.log(`App running on port ${port}...`)
})

// // 1) MIDDLEWARES
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

// app.use(express.json());
// app.use(express.static(`${__dirname}/public`));

// app.use((req, res, next) => {
//   console.log('Hello from the middleware 👋');
//   next();
// });

// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   next();
// });

// // 3) ROUTES
// app.use('/api/v1/tours', tourRouter);
// app.use('/api/v1/users', userRouter);

// module.exports = app;
