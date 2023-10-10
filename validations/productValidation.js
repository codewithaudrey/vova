const { body, param } = require('express-validator')

const validateCreateProduct = [
    body('title')
        .trim()
        .notEmpty()
        .isString()
        .isLength({ min: 5 })
        .withMessage('Product title is required and must be at least 5 characters'),
    body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),
    body('amount')
        .isInt({ min: 100 })
        .withMessage('Product amount must be greater than or equal to 100'),
]

const validateUpdateProduct = [
    param('id')
        .isMongoId()
        .withMessage('Invalid product ID'),
    body('title')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Product title should be at least 5 characters'),
    body('rating')
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be must be between 1 and 5'),
    body('amount')
        .optional()
        .isInt({ min: 100 })
        .withMessage('Product amount must be greater than or equal to 100'),
]

const validateProductId = [
    param('id')
        .isMongoId()
        .withMessage('Invalid product ID')
]


module.exports = {
    validateCreateProduct,
    validateUpdateProduct,
    validateProductId
}