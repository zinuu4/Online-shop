const { body } = require('express-validator');

const User = require('../../models/user');

exports.signupValidators = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom((email) => {
      return User.findOne({ email }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject('User already exists');
        }
      });
    })
    .normalizeEmail(),
  body(
    'password',
    'Password should contain 6-14 characters (only numbers and text)'
  )
    .isLength({ min: 6, max: 14 })
    .isAlphanumeric()
    .trim(),
  body('confirmPassword')
    .custom((password, { req }) => {
      if (password !== req.body.password) {
        throw new Error('Passwords have to match!');
      }
      return true;
    })
    .trim(),
];

exports.loginValidators = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  body(
    'password',
    'Password should contain 6-14 characters (only numbers and text)'
  )
    .isLength({ min: 6, max: 14 })
    .isAlphanumeric()
    .trim(),
];
