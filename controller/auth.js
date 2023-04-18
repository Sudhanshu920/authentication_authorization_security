const User = require('./../models/user');
const asyncWrapper = require('./../middleware/async');

exports.signUp = asyncWrapper(async (req, res) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: 'success',
    user: newUser,
  });
});
