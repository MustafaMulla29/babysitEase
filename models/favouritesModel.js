const mongoose = require("mongoose")

const favouritesSchema = mongoose.Schema({
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
}, { timestamps: true })

const favouritesModel = mongoose.model("favourites", favouritesSchema)

module.exports = favouritesModel