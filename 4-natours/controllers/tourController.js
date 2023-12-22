const Tour = require('./../models/tourModel')

exports.aliasTopTours = (req, res, next) => {
  // limit=5&sort=-ratingsAverage,price
  req.query.limit = '5'
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,price,ratingsAverage,summery,difficulty'
  next()
}

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query)
    // BULID QUERY
    // 1A) filtering

    // [Moriah] ...: 創造一結構，把所有的field從obj提出來(?)
    const queryObj = {...req.query}
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach (el => delete queryObj[el])

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`) // [Moriah] regular expression
    // [Moriah] hard coding
    // return a query
    let query = Tour.find(JSON.parse(queryStr))
    // const tours = await Tour.find().where('duration').equals('5').where('difficulty').equals('easy')

    // 2) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')  // [Moriah] join好像不成功??
      query = query.sort(sortBy)
      // sort('price ratingsAverage')
    } else {
      query = query.sort('-createdAt')
    }

    // 3) Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ')
      query = query.select('fields')
    } else {
      query = query.select('-__v')
    }

    // 4) Pagination
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 100
    const skip = (page - 1) * limit
    // page=3&limit=10, 1-10: page1
    query = query.skip(skip).limit(limit)

    if (req.query.page) {
      const numTours = await Tour.countDocuments()  // [Moriah] return a promise
      if (skip >= numTours) throw new Error('This page does not exit')
    }

    // EXECUTE QUERY
    const tours =  await query

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
        })
      } catch (err) {
        res.status(404).json({
          status: 'fail',
          message: err
    })
  }
}

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
    // Tour.findOne({_id: req.params.id})

    res.status(200).json({
      status: 'success',
      message: {
        tour
      }
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
}

exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour({})
    // newTour.save()
    // 不同於Model.prototype.save()

    const newTour = await Tour.create(req.body)

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid data send!',
    })
  }
}

exports.updateTour = async (req, res) => {
  try{
    // [Moriah] https://mongoosejs.com/docs/queries.html
      const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, 
      runValidators: true
    })

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
}

exports.deleteTour = async (req, res) => {
  try{
    // [Moriah] 不用儲存，因為是delete
    await Tour.findOneAndDelete(req.params.id)

    res.status(204).json({
      status: 'success',
      data: null
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
}
