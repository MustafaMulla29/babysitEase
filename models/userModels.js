const mongoose = require('mongoose')

const userDependentSchema = mongoose.Schema({
    type: {
        type: String,
        required: true,
        trim: true,
        enum: {
            values: ['Parent', 'Child'],
            message: 'Type must be parent or child'
        }
    },
    gender: {
        type: String,
        required: true,
        trim: true,
        enum: {
            values: ['male', 'female'],
            message: 'Gender must be male or female'
        }
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
    },
    allergies: {
        type: [String],
        default: [],
    },
    medicalConditions: {
        type: [String],
        default: [],
    },
    additionalInfo: {
        type: String,
        trim: true,
        lowercase: true
    }
});

const userSchema = mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now()
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: [true, "Phone number is required"],
        unique: true,
        select: false
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        trim: true,
    },
    // aadharNumber: {
    //     type: Number,
    //     required: [true, 'Aadhar number is required']
    // },
    role: {
        type: String,
        required: [true, 'Role is required'],
        trim: true,
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
    },
    additionalAddresses: {
        type: [String],
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
    },
    gender: {
        type: String,
        required: true,
        trim: true,
        enum: {
            values: ['male', 'female'],
            message: 'Gender must be male or female'
        }
    },
    profilePicture: {
        type: String,
        required: [true, 'Profile picture is required']
    },
    dependents: {
        type: [userDependentSchema],
        default: []
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isCaregiver: {
        type: Boolean,
        default: false
    },
    notification: {
        type: Array,
        default: []
    },
    seenNotification: {
        type: Array,
        default: []
    },

}, { timestamps: true })

const userModel = mongoose.model('users', userSchema)

module.exports = userModel