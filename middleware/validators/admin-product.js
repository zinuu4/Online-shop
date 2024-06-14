const { body } = require('express-validator');

exports.editProductValidators = [
  body('title')
    .isLength({ min: 2, max: 30 })
    .withMessage('Title should contain 2-30 characters')
    .trim(),
  body('imageUrl').isURL().withMessage('Enter valid URL').trim(),
  body('description')
    .isLength({ min: 5, max: 300 })
    .withMessage('Description should be 10-300 characters long')
    .trim(),
  body('price')
    .isFloat({ min: 0.01 })
    .withMessage('Price should be a non negative floating-point number')
    .trim(),
];
