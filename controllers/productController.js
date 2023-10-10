const Product = require('../models/productModel')
const fs = require('fs')
const { validationResult } = require('express-validator')

const createProduct = async (req, res) => {
    const product = req.body
    const image = req.file

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() })
    }

    try {
        const createdProduct = await Product.create({ ...product, image: image.filename })

        return res.status(200).json({ message: createdProduct })
    }
    catch (error) {
        return res.status(500).json({ message: 'Unable to create product ' + error.message })
    }
}

const updateProduct = async (req, res) => {
    const { id } = req.params
    const data = req.body
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() })
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });

        return res.status(200).json({ message: updatedProduct });
    }
    catch (error) {
        return res.status(500).json({ message: 'Unable to update product data ' + error.message })
    }
}

const deleteProduct = async (req, res) => {
    const errors = validationResult(req)
    const { id } = req.params

    if (!errors.isEmpty()) {
        return res.status(300).json({ message: errors.array() })
    }

    try {
        // find product with id
        const product = await Product.findById(id);

        // check if product exists
        if (!product) {
            return res.status(404).json({ message: 'Unable to find product' })
        }

        // product image directory
        const dir = 'uploads/products/'
        // delete associated image
        fs.unlinkSync(dir + product.image)

        await Product.findByIdAndDelete(id)

        return res.status(200).json({ message: 'Product deleted successfully' })
    }
    catch (error) {
        return res.status(500).json({ message: 'Unable to delete product ' + error.message })
    }
}

const getProduct = async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(300).json({ message: errors.array() })
    }


    try {
        const getProduct = await Product.findOne({ _id: id })

        return res.status(200).json({ message: getProduct })
    }

    catch (error) {
        return res.status(500).json({ message: 'Unable to find product ' + error.message })
    }
}

const allProducts = async (req, res) => {
    try {
        const allProducts = await Product.find()

        if (allProducts.length < 1) {
            return res.status(400).json({ message: 'No product was found' })
        }

        return res.status(200).json({ message: allProducts })
    }
    catch (error) {
        return res.status(500).json({ message: 'Unable to find products ' + error.message })
    }
}

module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    allProducts,
}