const express = require("express")
const authMiddleware = require("../middlewares/authMiddleware")
const { getCaregiverInfoController, updateCaregiverController } = require("../controllers/caregiverCtrl")
const upload = require("../multerConfig")

const router = express.Router()

//GET || SINGLE NURSE DETAILS
router.post('/getCaregiverInfo', authMiddleware, getCaregiverInfoController)

//PATCH || SINGLE NURSE DETAILS
router.patch('/updateCaregiver', upload.single('profilePicture'), upload.array('certifications', 10), authMiddleware, updateCaregiverController)


module.exports = router