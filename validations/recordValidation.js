const { body, param } = require('express-validator')

const validateCreateRecord = [
    body('title')
        .trim()
        .notEmpty()
        .isString()
        .withMessage('Provide the product with a title'),
    body('image')
        .trim()
        .isString()
        .isLength({ min: 8 })
        .withMessage('Product image url cannot be null or empty'),
    body('amount')
        .isInt({ min: 100, max: 1000 })
        .withMessage('Product amount must be greater than or equal to 100'),
    body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Product rating must be between 1 and 5'),
    body('productId')
        .trim()
        .isString()
        .isLength({ min: 8 })
        .withMessage('Invalid product ID'),
]

const validateUserId = [
    param('userId')
        .isMongoId()
        .withMessage('Invalid user ID'),
]

module.exports = {
    validateCreateRecord,
    validateUserId
}