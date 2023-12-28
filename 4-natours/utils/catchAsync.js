module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
    // [Moriah] error會透過next傳給error handling middleware
  }
}