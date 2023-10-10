const multer = require('multer')
const path = require('path')

const storage = (folderName) => multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads', folderName))
    },

    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.floor(Math.random() * 1e9)
        const extension = file.originalname.split('.').pop()
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + extension)
    }
})

module.exports = storage