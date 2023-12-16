const mongoose = require('mongoose')
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './after-section-06/config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB, {
  // [Moriah] 處理棄用警告的選項
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(() => console.log('DB connection successful!'))

// [Moriah] 指定類型
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],  // [Moriah] validater
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  }
})

// [Moriah] model name/params 用大寫
const Tour = mongoose.model('Tour', tourSchema)

const testTour = new Tour({
  name: 'The Forest Hiker',  // [Moriah] 用相同名稱儲存會報錯
  rating: 4.7,
  price: 497
})

// [Moriah] saved to DB, return a promise
testTour.save().then(doc => {
  console.log(doc)
}).catch(err => {
  console.log('ERROR!', err)
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
