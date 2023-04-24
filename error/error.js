class appError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const newError = (msg, statusCode) => {
  return new appError(msg, statusCode);
};

module.exports = newError;
