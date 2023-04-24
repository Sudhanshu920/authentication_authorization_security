const asyncWrapper = require('../middleware/async');
const User = require('../models/user');

exports.getAllUser = asyncWrapper(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});
