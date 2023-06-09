const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    reqired: [true, 'please enter your name'],
  },
  email: {
    type: String,
    required: [true, 'please enter your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'password and passwordConfirm should be same',
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.checkPassword = async (enteredPassword, userPassword) => {
  return await bcrypt.compare(enteredPassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (tokenTime) {
  if (this.passwordChangedAt) {
    const changeTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000);
    return tokenTime < changeTimeStamp;
  }

  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
