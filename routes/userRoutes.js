const express = require('express')
const { loginController, registerController, authController, getNotificationsController, deleteNotificationsController, applyCaregiverController, addDependentController } = require('../controllers/userCtrl')
const authMiddleware = require('../middlewares/authMiddleware')
const upload = require('../multerConfig')


//router object
const router = express.Router()

//routes
//LOGIN || POST
router.post('/login', loginController)

//REGISTER ||POST
// router.post('/register', registerController)
router.post('/register', upload.single("profilePicture"), registerController)

//Auth || POST
router.post('/getUserData', authMiddleware, authController)

//APPLY NURSE || POST
router.post("/apply-caregiver", upload.array("certifications"), authMiddleware, applyCaregiverController)

//NOTIFICATION || POST
router.post("/get-notifications", authMiddleware, getNotificationsController)
//DELETE ALL NOTIFICATIONS || POST
router.post("/delete-notifications", authMiddleware, deleteNotificationsController)

//ADD DEPENDENT ROUTE || POST
router.post("/addDependent", authMiddleware, addDependentController)

module.exports = router