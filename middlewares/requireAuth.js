const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ message: 'Authorization token required' })
    }

    const token = authorization.split(' ').pop()

    try {
        const { _id } = jwt.verify(token, process.env.SECRET_KEY)

        req.user = await User.findOne({ _id }).select('_id')
        next()
    }
    catch (error) {
        return res.status(401).json({ message: 'Token is not valid' })
    }
}

module.exports = requireAuth