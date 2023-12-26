const mongoose = require('mongoose')
const slugify = require('slugify')

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      // enum: {
      //   values: ['easy', 'medium', 'difficult'],
      //   message: 'Difficulty is either: easy, medium, difficult'
      // }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      // validate: {
      //   validator: function(val) {
      //     // this only points to current doc on NEW document creation
      //     return val < this.price;
      //   },
      //   message: 'Discount price ({VALUE}) should be below regular price'
      // }
    },
    summary: {
      type: String,
      // [Moriah] trim only work on string, 會刪除開頭和結尾的空格
      trim: true,
      required: [true, 'A tour must have a description']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    }
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
}
)

// [Moriah] virtual property: 不會永久存在DB
// 不用箭頭函數，因為箭頭函數不能用this
tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7
})

// DOCUMENT MIDDLEWARE: runs before .save() and .create() .insertMany
// [Moriah] pre save hook(?)
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, {lower: true})
  next()
})

// tourSchema.pre('save', function(next) {
//   console.log('Will save document...')
//   next()
// })

// tourSchema.post('save', function(doc, next) {
//   // [Moriah] runs after "pre"，DB中已有document
//   console.log(doc)
//   next()
// })

// QUERY MIDDLEWARE
// tourSchema.pre('find', function(next) {
// [Moriah] included strings startd with find(): find(), findOne(), findOneAndDelete()...
tourSchema.pre(/^find/, function(next) {
  this.find({secretTour: {$ne: true}})

  this.strat = Date.now()
  next()
})

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.strat} milliseconds`)
  console.log(docs)
  next()
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour
