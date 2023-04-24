const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/user');
const asyncWrapper = require('./../middleware/async');
const newError = require('./../error/error');
require('dotenv').config();

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRES_IN,
  });
};

exports.signUp = asyncWrapper(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  const token = createToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    user: newUser,
  });
});

exports.login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(newError('email and password field is mandatory', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(newError('invalid email/password', 401));
  }

  user.password = undefined;
  const token = createToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
});

exports.protect = asyncWrapper(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      newError('you are not logged in! please try again to get access', 401)
    );
  }

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const freshUser = await User.findById(decode.id);
  if (!freshUser) {
    return next(newError('user belonging to this token no longer exist', 401));
  }

  if (freshUser.changedPasswordAfter(decode.iat)) {
    return next(newError('you recently changed password. log in again', 401));
  }

  req.user = freshUser;

  next();
});
