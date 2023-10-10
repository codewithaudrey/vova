const express = require('express')
const requireAuth = require('../middlewares/requireAuth')

const {
    createRecord,
    userRecords
} = require('../controllers/recordController')

const {
    validateCreateRecord,
    validateUserId
} = require('../validations/recordValidation')


const router = express.Router()
router.use(requireAuth)


router.post('/create', validateCreateRecord, createRecord)
router.get('/:userId', validateUserId, userRecords)

module.exports = router