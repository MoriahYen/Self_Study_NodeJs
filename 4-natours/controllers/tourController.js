const Tour = require('./../models/tourModel')
const APIFeatures = require('./../utils/apiFeatures')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')

exports.aliasTopTours = (req, res, next) => {
  // limit=5&sort=-ratingsAverage,price
  req.query.limit = '5'
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
  next()
}

exports.getAllTours = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()

  const tours = await features.query

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  })
})

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id)
  // Tour.findOne({_id: req.params.id})

  if (!tour) {
    return next(new AppError('No tour found with that id', 404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  })
})

exports.createTour = catchAsync(async (req, res, next) => {
  //const newTour = new Tour({})
  // newTour.save()
  // 不同於Model.prototype.save()

  const newTour = await Tour.create(req.body)

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour
    }
  })
})

exports.updateTour = catchAsync(async (req, res, next) => {
  // [Moriah] https://mongoosejs.com/docs/queries.html
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  if (!tour) {
    return next(new AppError('No tour found with that id', 404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  })
})

exports.deleteTour = catchAsync(async (req, res, next) => {
  // [Moriah] 不用儲存，因為是delete
  const tour = await Tour.findOneAndDelete(req.params.id)

  if (!tour) {
    return next(new AppError('No tour found with that id', 404))
  }

  res.status(204).json({
    status: 'success',
    data: null
  })
})

// [Moriah] Aggregation pipeline
// https://www.mongodb.com/docs/atlas/atlas-sp/stream-aggregation/
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 } // [Moriah] 1: assending
    }
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ])
  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  })
})

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1

  const plan = await Tour.aggregate([
    {
      // [Moriah] unwind: 從檔案中解構一個數組字段，再為數組的每個元素輸出一個文檔
      // ex: The Forest Hiker有三個日期，所以分成三個文檔
      $unwind: '$startDates'
    },
    {
      // [Moriah] match用來選擇文檔
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: { _id: 0 }
    },
    {
      $sort: { numTourStarts: -1 }
    },
    {
      $limit: 12
    }
  ])
  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  })
})
