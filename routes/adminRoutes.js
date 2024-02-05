const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const { getAllUsersController, getAllCaregiversController, changeAccountStatusController, getAdminDetailsController, blockUserController } = require('../controllers/adminCtrl')

const router = express.Router()

//GET || USERS OR CLIENTS
router.get('/getAllUsers', authMiddleware, getAllUsersController)

//GET || CAREGIVERS
router.get('/getAllCaregivers', authMiddleware, getAllCaregiversController)
//GET || CAREGIVERS
router.get('/getAdminDetails', authMiddleware, getAdminDetailsController)

//POST || ACCOUNT STATUS
router.post('/changeAccountStatus', authMiddleware, changeAccountStatusController)

router.patch("/blockUser/:userId", authMiddleware, blockUserController)

module.exports = router