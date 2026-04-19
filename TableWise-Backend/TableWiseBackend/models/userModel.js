const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const autoIncrement = require('../middleware/autoIncrement');

const UserSchema = new mongoose.Schema({
  _id: {
    type: Number
  },
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
      "Please add a valid email",
    ],
  },
  role: {
    type: String,
    enum: ['employee', 'manager','admin'],
    default: 'employee'
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  tokenInvalidBefore: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })
}

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}
autoIncrement(UserSchema, 'userId');
module.exports.User = mongoose.model('User', UserSchema,'users')