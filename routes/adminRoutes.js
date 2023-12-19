const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const { getAllUsersController, getAllCaregiversController, changeAccountStatusController } = require('../controllers/adminCtrl')

const router = express.Router()

//GET || USERS OR CLIENTS
router.get('/getAllUsers', authMiddleware, getAllUsersController)

//GET || CAREGIVERS
router.get('/getAllCaregivers', authMiddleware, getAllCaregiversController)

//POST || ACCOUNT STATUS
router.post('/changeAccountStatus', authMiddleware, changeAccountStatusController)

module.exports = router