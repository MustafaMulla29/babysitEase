const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema({
    bookedAt: {
        type: Date,
        default: Date.now()
    },
    //this will be the id of user who booked
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Booking id is required"],
    },
    //id of the caregiver
    caregiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "caregiver",
        required: [true, "Caregiver id is required"]
    },
    date: {
        type: Date,
        required: [true, "Booking date is required"]
    },
    status: {
        type: String,
        // required: true,
        enum: {
            values: ['Pending', 'Approved', 'Rejected'],
            message: 'Status must be pending, approved or rejected'
        },
        default: "Pending"
    },
}, { timestamps: true })

const bookingModel = mongoose.model("booking", bookingSchema)

module.exports = bookingModel