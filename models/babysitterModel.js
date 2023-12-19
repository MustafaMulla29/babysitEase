const mongoose = require('mongoose')

const babysitterSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    yearsExperience: {
        type: Number,
        default: 1,
    },
    reveiw: {
        type: Array,
        default: [Object],
    },
    rating: {
        type: Number,
        default: 0,
    },
    feesPerDay: {
        type: Number,
        required: [true, 'Fees per day is required']
    },
    availability: {
        type: Boolean,
        default: true
    },
    preferredCities: {
        type: [String],
        required: [true, 'Preferred cities are required'],
    },
    qualification: {
        type: [String],
        required: [true, 'Qualification is true'],
    },
    specialisation: {
        type: [String],
        required: [true, 'Specialisation is required'],
    },
    certifications: {
        type: [String],
    },
    ageRange: {
        lowerLimit: {
            type: Number,
            required: [true, 'Lower limit for age range is required'],
            min: 1,
            max: 99
        },
        upperLimit: {
            type: Number,
            required: [true, 'Upper limit for age range is required'],
            min: 2,
            max: 100
        }
    },
    status: {
        type: String,
        default: "Pending",
        trim: true,
    }
}, { timestamps: true })

const babysitterModel = mongoose.model('babysitter', babysitterSchema)

module.exports = babysitterModel