const { body, param } = require('express-validator');

const validateSignUp = [
    body('balance')
        .isInt({ min: 0 })
        .withMessage('Unable to sign up. Validation failed'),
    body('mobile')
        .trim()
        .isLength({ min: 7, max: 20 })
        .withMessage(' Invalid mobile number'),
    body('username')
        .trim()
        .isLength({ min: 2, max: 30 })
        .withMessage('Username must be between 2 and 30 characters'),
    body('gender')
        .trim()
        .isLength({ min: 2, max: 30 })
        .withMessage('Your gender is required'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[^\s]*$/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one digit, and no spaces'),
    body('withdrawalPassword')
        .trim()
        .isLength({ min: 8 })
        .withMessage('Withdrawal password must be at least 8 characters')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[^\s]*$/)
        .withMessage('Withdrawal password must contain at least one uppercase letter, one lowercase letter, and one digit, and no spaces'),
    body('inviteCode')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Invalid invitation code'),
]

const isValidUsername = (input) => {
    const usernameRegex = /^[a-zA-Z0-9_]+$/; // Only allows letters, digits, and underscores
    return usernameRegex.test(input);
}

const isValidPhoneNumber = (input) => {
    const phoneRegex = /^\d{10}$/; // Assumes a 10-digit phone number
    return phoneRegex.test(input);
}

const validateSignIn = [
    body('auth')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Sign in with your validated email address or username')
        .custom((value) => {
            if (!isValidUsername(value) && !isValidPhoneNumber(value)) {
                return false;
            }
            return true
        })
        .withMessage('Invalid username or phone number'),
    body('userPassword')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[^\s]*$/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one digit, and no spaces'),
]

// validate for resetting or updating password
const validateResetPassword = [
    body('userPassword')
        .isLength({ min: 8 })
        .withMessage('User password must be at least 8 characters')
        .matches(/^(?=.*\d)(?=.*[a-x])(?=.*[A-Z])[^\s]*$/)
        .withMessage('User password must contain at least one uppercase letter, one lowercase letter, and one digit, and no spaces'),

    body('newPassword')
        .isLength({ min: 8 })
        .withMessage('New password must be at least 8 characters')
        .matches(/^(?=.*\d)(?=.*[a-x])(?=.*[A-Z])[^\s]*$/)
        .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one digit, and no spaces'),

]

// validate user update data 
const validateUpdateData = [
    param('id').isMongoId()
        .withMessage('Invalid object ID'),
    body('balance')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Only numbers are allowed'),
    body('mobile')
        .optional()
        .trim()
        .isLength({ min: 7, max: 20 })
        .withMessage(' Invalid mobile number'),
    body('username')
        .optional()
        .trim()
        .isEmpty()
        .isString()
        .isLength({ min: 2, max: 30 })
        .withMessage('Username must be between 2 and 30 characters'),
    body('gender')
        .optional()
        .trim()
        .isLength({ min: 2, max: 30 })
        .withMessage('Your gender is required')
]


module.exports = ({
    validateSignUp,
    validateSignIn,
    validateResetPassword,
    validateUpdateData,
})