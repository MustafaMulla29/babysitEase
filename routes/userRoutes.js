const express = require('express')
const { loginController, registerController, authController, getNotificationsController, deleteNotificationsController, applyCaregiverController, addDependentController, getAllCaregiversController, getCaregiverDetails, bookCaregiverController, getBookingsController, addReviewController, cancelBookingController, searchCaregiversController, deleteDependentController, addFavouritesController, checkFavouritedController, getFavouritesController, updateUserController, getAdditionalAddressesController, getDependentNamesController } = require('../controllers/userCtrl')
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
router.patch("/updateUser", upload.single("profilePicture"), authMiddleware, updateUserController)

//NOTIFICATION || POST
router.post("/get-notifications", authMiddleware, getNotificationsController)
//DELETE ALL NOTIFICATIONS || POST
router.post("/delete-notifications", authMiddleware, deleteNotificationsController)

//ADD DEPENDENT ROUTE || POST
router.post("/addDependent", authMiddleware, addDependentController)
router.get("/getDependentNames/:caregiverId/:clientId", authMiddleware, getDependentNamesController)

//Delete DEPENDENT ROUTE || POST
router.delete("/deleteDependent/:userId/:dependentId", authMiddleware, deleteDependentController)

//GET ALL CAREGIVERS || GET
router.get("/getAllCaregivers", authMiddleware, getAllCaregiversController)

//GET A CAREGIVER DETAILS|| GET
router.get("/getCaregiverDetails/:userId", authMiddleware, getCaregiverDetails)

//BOOK CAREGIVER || POST
router.post("/bookCaregiver", authMiddleware, bookCaregiverController)

//GET BOOKINGS 
router.get("/getBookings", authMiddleware, getBookingsController)

//POST REVIEWS 
router.post("/addReview", authMiddleware, addReviewController)

//POST CANCEL BOOKING
router.post("/cancelBooking", authMiddleware, cancelBookingController)

//GET SEARCH CAREGIVERS
router.get("/searchCaregivers", authMiddleware, searchCaregiversController)

router.post("/addFavourite", authMiddleware, addFavouritesController)

router.get("/getFavourites/:clientId", authMiddleware, getFavouritesController)
router.get("/getAdditionalAddresses/:clientId", authMiddleware, getAdditionalAddressesController)
// router.get("/checkFavourited/:clientId/:caregiverId", authMiddleware, checkFavouritedController)



module.exports = router