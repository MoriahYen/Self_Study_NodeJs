class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // [Moriah] captureStackTrace: 一個非標準的 V8 函數，用於在錯誤實例上建立stack屬性。
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
