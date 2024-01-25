const catchAsync = require('../utils/catchAsync')
const Review = require('./../models/reviewModel')
// const factory = require('./handlerFactory');
// const catchAsync = require('./../utils/catchAsync');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find()

  res.status(201).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  })
})

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId
  if (!req.body.user) req.body.user = req.user.id

  const newReview = await Review.create(req.bosy)

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview
    }
  })
})

// exports.getAllReviews = factory.getAll(Review);
// exports.getReview = factory.getOne(Review);
// exports.createReview = factory.createOne(Review);
// exports.updateReview = factory.updateOne(Review);
// exports.deleteReview = factory.deleteOne(Review);
