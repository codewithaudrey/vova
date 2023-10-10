const express = require('express')
const multer = require('multer')
const storage = require('../middlewares/multer')

// handles validation rules for avatar image upload
const uploadAvatar = multer({
    storage: storage('avatars'),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            // if the file is not a valid image file, return an error
            return cb(new Error('Invalid image file'), false)
        }

        const allowedExtensions = ['jpeg', 'png', 'jpg', 'gif']

        //pops out the file extension
        const fileExtension = file.originalname.split('.').pop()

        // check if the file extension is allowed
        if (!allowedExtensions.includes(fileExtension)) {
            return cb(
                new Error('Invalid file extension. Only images .jpg, .png, jpeg, and .gif are allowed'),
                false
            )
        }

        cb(null, true)
    }
})

// controllers
const {
    signUp,
    signIn,
    updateAvatar,
    resetPassword,
    updateData,
} = require('../controllers/userController')

// routes request validation middlewares
const {
    validateSignUp,
    validateSignIn,
    validateUpdateData,
    validateResetPassword,
} = require('../validations/userValidation')

const router = express.Router()

router.post('/create', validateSignUp, signUp)
router.post('/access', validateSignIn, signIn)
router.post(
    '/update/avatar/:id',
    uploadAvatar.single('avatar'),
    updateAvatar
)
router.patch('/reset/:type/:id', validateResetPassword, resetPassword)
router.patch('/update/:id', validateUpdateData, updateData)

module.exports = router