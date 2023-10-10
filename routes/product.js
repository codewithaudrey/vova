const express = require('express');
const multer = require('multer');
const storage = require('../middlewares/multer')
const requireAuth = require('../middlewares/requireAuth')

const {
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    allProducts,
} = require('../controllers/productController')

const {
    validateUpdateProduct,
    validateCreateProduct,
    validateProductId
} = require('../validations/productValidation')

const upload = multer({
    storage: storage('products'),
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

const router = express.Router()
router.use(requireAuth)

router.post('/create', upload.single('image'), validateCreateProduct, createProduct)
router.patch('/update/:id', validateUpdateProduct, updateProduct)
router.delete('/delete/:id', validateProductId, deleteProduct)
router.get('/single/:id', validateProductId, getProduct)
router.get('/', allProducts)

module.exports = router
