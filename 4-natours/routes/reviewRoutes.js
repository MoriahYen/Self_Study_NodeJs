const express = require('express')
const reviewController = require('./../controllers/reviewController')
const authController = require('./../controllers/authController')

// [Moriah] 為了訪問其他router的路徑
const router = express.Router({ mergeParams: true })

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  )

module.exports = router
