const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Record = new Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    amount: { type: Number, required: true },
    rating: { type: String, required: true },
    productId: { type: String, required: true },
    userId: { type: String, required: true }
}, { timestamps: true })

module.exports = mongoose.model('Record', Record)