const caregiverModel = require("../models/caregiverModel");
const userModel = require("../models/userModels");

const getCaregiverInfoController = async (req, res) => {
    try {
        const caregiver = await caregiverModel.findOne({ userId: req.body.userId })
        const user = await userModel.findOne({ _id: req.body.userId })
        let caregiverData

        if (caregiver && user) {
            caregiverData = {
                ...caregiver.toObject(),
                ...user.toObject(),
            }
        } else {
            caregiverData = user
        }
        console.log(caregiverData)
        res.status(200).send({
            success: true,
            message: "Nurse data fetched successfully",
            data: caregiverData
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while getting caregiver details",
            error
        })
    }
}

const updateCaregiverController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId })
        const caregiver = await caregiverModel.findOne({ userId: req.body.userId })
        let updatedCaregiver
        let updatedUser

        if (caregiver) {
            updatedCaregiver = await caregiverModel.findOneAndUpdate({ userId: req.body.userId }, req.body.nurse, {
                runValidators: true, new: true
            })
        }

        if (user) {
            updatedCaregiver = await userModel.findOneAndUpdate({ _id: req.body.userId }, req.body.user, {
                runValidators: true, new: true
            })
        }


        res.status(200).send({
            success: true,
            message: "Profile updated successfully",
            updatedUser,
            updatedCaregiver,
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while updating nurse details",
            error
        })
    }
}

module.exports = { getCaregiverInfoController, updateCaregiverController }