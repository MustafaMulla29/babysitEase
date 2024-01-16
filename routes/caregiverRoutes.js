const express = require("express")
const authMiddleware = require("../middlewares/authMiddleware")
const { getCaregiverInfoController, updateCaregiverController, getBookingsController, bookingStatusController, getReviewsController, approveBookingController } = require("../controllers/caregiverCtrl")
const upload = require("../multerConfig")
const router = express.Router()

//GET || SINGLE NURSE DETAILS
router.get('/getCaregiverInfo/:id', authMiddleware, getCaregiverInfoController)

const fieldsConfig = [
    { name: 'profilePicture', maxCount: 1 },
    { name: 'certifications', maxCount: 10 },
];
//PATCH || SINGLE NURSE DETAILS
router.patch('/updateCaregiver', authMiddleware, upload.any(), updateCaregiverController)

router.get("/getBookings", authMiddleware, getBookingsController)

router.post("/bookingStatus", authMiddleware, bookingStatusController)

router.get("/getReviews/:caregiverId", authMiddleware, getReviewsController)

router.patch("/changeBookingStatus", authMiddleware, approveBookingController)


module.exports = router