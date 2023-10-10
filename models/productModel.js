const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productSchema = new Schema({
    title: { type: 'string', required: true },
    image: { type: 'string', required: true },
    rating: { type: 'number', required: true },
    amount: { type: 'number', required: true },
}, { timestamps: true })

module.exports = mongoose.model('Product', productSchema)