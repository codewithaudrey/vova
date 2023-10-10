require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const userRoutes = require('./routes/user')
const productRoutes = require('./routes/product')
const recordRoutes = require('./routes/record')
const path = require('path')

const app = express()

// middlewares
app.use(express.json())
app.use(cors())

app.use('/uploads/avatars/', express.static(path.join(__dirname, 'uploads/avatars')))

// logging each request in the console
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes
app.use('/api/user', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/records', recordRoutes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))


// mongoose connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        //listen to port for requests
        app.listen(process.env.PORT, () => console.log('Server is running on port ' + process.env.PORT + '. Happy coding!'))

    })
    .catch(error => {
        console.error('Error connecting to database:', error)
    })
