class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1A) filtering
    const queryObj = { ...this.queryString }; // [Moriah] create new obj
    const excludedFields = ['page', 'sort', 'limit', 'fields']; // 排除'page', 'sort', 'limit', 'fields'
    excludedFields.forEach(el => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    // [Moriah] regular expression，增加$符號

    this.query = this.query.find(JSON.parse(queryStr));

    // [Moriah]
    // 因為const features = new APTFeatures(Tour.find(), req.query).filter()不回傳東西
    // 所以需要return this(entire obj)，這樣
    // const features = new APTFeatures(Tour.find(), req.query).filter().sort()才能串接
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' '); // [Moriah] join好像不成功??
      this.query = this.query.sort(sortBy);
      // sort('price ratingsAverage') 若有相同的price，會根據ratingsAverage排序
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields); // [Moriah] projecting
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    // page=3&limit=10, 1-10: page1
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
module.exports = APIFeatures;
