const mongoose = require("mongoose")

const subscriptionScema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "User id is required"]
    },
    purchasedDate: {
        type: Date,
        default: Date.now()
    },
    expiryDate: {
        type: Date,
        required: [true, "Subscription end date is required"]
    },
    plan: {
        type: String,
        required: [true, "Subscription plan is required"]
    },
    price: {
        type: String,
        required: [true, "Subscription price is required"]
    },
    status: {
        type: String,
        required: [true, "Status is required"]
    }
})

const subscriptionModel = mongoose.model("subscription", subscriptionScema)

module.exports = subscriptionModel