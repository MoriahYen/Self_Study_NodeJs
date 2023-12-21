const Tour = require('./../models/tourModel')

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query)
    // BULID QUERY
    // 1) filtering

    // [Moriah] ...: 創造一結構，把所有的field從obj提出來(?)
    const queryObj = {...req.query}
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach (el => delete queryObj[el])

    // 2) Advanced filtering
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`) // [Moriah] regular expression
    console.log(JSON.parse(queryStr))
    // [Moriah] hard coding
    // return a query
    const query = Tour.find(JSON.parse(queryStr))
    // const tours = await Tour.find().where('duration').equals('5').where('difficulty').equals('easy')

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
