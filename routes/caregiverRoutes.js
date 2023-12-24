const express = require("express")
const authMiddleware = require("../middlewares/authMiddleware")
const { getCaregiverInfoController, updateCaregiverController } = require("../controllers/caregiverCtrl")
const upload = require("../multerConfig")
const router = express.Router()

//GET || SINGLE NURSE DETAILS
router.post('/getCaregiverInfo', authMiddleware, getCaregiverInfoController)

const fieldsConfig = [
    { name: 'profilePicture', maxCount: 1 },
    { name: 'certifications', maxCount: 10 },
];
//PATCH || SINGLE NURSE DETAILS
router.patch('/updateCaregiver', authMiddleware, upload.any(), updateCaregiverController)


module.exports = router