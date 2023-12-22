const Tour = require('./../models/tourModel')
const APIFeatures = require('./../utils/apiFeatures')

exports.aliasTopTours = (req, res, next) => {
  // limit=5&sort=-ratingsAverage,price
  req.query.limit = '5'
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,price,ratingsAverage,summery,difficulty'
  next()
}

exports.getAllTours = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APTFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()
    
    const tours =  await features.query

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
