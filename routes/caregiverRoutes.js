const express = require("express")
const authMiddleware = require("../middlewares/authMiddleware")
const { getCaregiverInfoController, updateCaregiverController } = require("../controllers/caregiverCtrl")

const router = express.Router()

//GET || SINGLE NURSE DETAILS
router.post('/getCaregiverInfo', authMiddleware, getCaregiverInfoController)

//PATCH || SINGLE NURSE DETAILS
router.patch('/updateCaregiver', authMiddleware, updateCaregiverController)


module.exports = router