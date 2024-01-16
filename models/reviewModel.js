const mongoose = require('mongoose');
const caregiverModel = require('./caregiverModel');

const reviewSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: [true, "Review date is required"]
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Client id is required"],
    },
    caregiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "caregiver",
        required: [true, "Caregiver id is required"],
    },
    rating: {
        type: Number,
        required: [true, "Rating is required"],
        default: 0,
    },
    comment: {
        type: String,
        required: [true, "Review comment is required"],
        trim: true
    },
    feedback: {
        type: String,
        trim: true,
        required: [true, "Feedback is required"]
    }

}, { timestamps: true })


reviewSchema.post('save', async function (doc) {
    const caregiverId = doc.caregiverId;

    // Calculate average rating for the caregiver
    const reviews = await this.model('review').find({ caregiverId });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    // Update the caregiver's document with the new average rating
    await caregiverModel.updateOne({ userId: caregiverId }, { rating: averageRating });
});

const reviewModel = mongoose.model("review", reviewSchema)

module.exports = reviewModel
