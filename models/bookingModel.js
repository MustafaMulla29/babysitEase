const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema({
    bookedAt: {
        type: Date,
        default: Date.now()
    },
    //this will be the id of user who booked
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Client id is required"],
    },
    //id of the caregiver
    caregiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "caregiver",
        required: [true, "Caregiver id is required"]
    },
    bookedFor: {
        type: String,
        required: [true, "Booked for is required"]
    },
    dependentType: {
        type: String,
        required: true,
        enum: {
            values: ["Parent", "Child"],
            message: "Dependent type must be parent or child"
        }
    },
    date: {
        type: Date,
        required: [true, "Booking date is required"]
    },
    endDate: {
        type: Date,
        required: [true, "Booking end date is required"]
    },
    jobAddress: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        // required: true,
        enum: {
            values: ['Pending', 'Approved', 'Rejected', 'Completed', 'Nullified'],
            message: 'Status must be pending, approved , rejected or completed'
        },
        default: "Pending"
    },
}, { timestamps: true })

const bookingModel = mongoose.model("booking", bookingSchema)

module.exports = bookingModel