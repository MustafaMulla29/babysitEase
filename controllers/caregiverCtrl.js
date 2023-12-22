const caregiverModel = require("../models/caregiverModel");
const userModel = require("../models/userModels");
const path = require('path');
const fs = require("fs").promises

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

// const updateCaregiverController = async (req, res) => {
//     try {
//         console.log(req.body)
//         const user = await userModel.findOne({ _id: req.body.userId })
//         const caregiver = await caregiverModel.findOne({ userId: req.body.userId })
//         const ageRange = JSON.parse(req.body.caregiver.ageRange)
//         let updatedCaregiver
//         let updatedUser
//         const {
//             experience,
//             feesPerDay,
//             preferredCities,
//             description,
//             qualification,
//             specialisation,
//         } = req.body.caregiver;
//         if (caregiver) {
//             updatedCaregiver = await caregiverModel.findOneAndUpdate({ userId: req.body.userId }, {
//                 experience,
//                 feesPerDay,
//                 preferredCities,
//                 description,
//                 qualification,
//                 specialisation, ageRange
//             }, {
//                 runValidators: true, new: true
//             })
//             if (req.files && req.files.certifications) {
//                 updatedCaregiver.certifications = req.files.certifications.map(file => file.path);
//                 await updatedCaregiver.save();
//             }
//         }

//         if (user) {
//             updatedUser = await userModel.findOneAndUpdate({ _id: req.body.userId }, req.body.user, {
//                 runValidators: true, new: true
//             })
//             if (req.files && req.files.profilePicture) {
//                 updatedUser.profilePicture = req.files.profilePicture[0].path;
//                 await updatedUser.save();
//             }
//         }


//         res.status(200).send({
//             success: true,
//             message: "Profile updated successfully",
//             updatedUser,
//             updatedCaregiver,
//         });

//     } catch (error) {
//         console.log(error)
//         res.status(500).send({
//             success: false,
//             message: "Error while updating nurse details",
//             error
//         })
//     }
// }
const updateCaregiverController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId })
        const caregiver = await caregiverModel.findOne({ userId: req.body.userId })
        const ageRange = JSON.parse(req.body.ageRange)
        let updatedCaregiver
        let updatedUser

        const {
            name,
            address,
            yearsExperience,
            feesPerDay,
            preferredCities,
            description,
            qualification,
            specialisation,
            availability,
            deleteCertificates,
            userId
        } = req.body;

        if (caregiver) {
            updatedCaregiver = await caregiverModel.findOneAndUpdate(
                { userId: userId },
                {
                    yearsExperience,
                    feesPerDay,
                    preferredCities,
                    description,
                    qualification,
                    specialisation,
                    ageRange,
                    availability,
                },
                { runValidators: true, new: true }
            );
            await updatedCaregiver.save()

            if (deleteCertificates && (deleteCertificates.length === 0 || deleteCertificates.length > 0)) {
                for (const certificate of deleteCertificates) {
                    const certificationPath = path.join(__dirname, '..', certificate.replace(/\\/g, '/'));
                    await fs.unlink(certificationPath, (err) => {
                        if (err) {
                            console.error(`Error deleting file: ${err.message}`);
                        } else {
                            console.log('File deleted successfully');
                        }
                    });

                    // Remove the certification from the updatedCaregiver.certifications array
                    updatedCaregiver.certifications = updatedCaregiver.certifications.filter(cert => cert !== certificate);
                }
                await updatedCaregiver.save();
            }

            if (req.files) {
                const newCertifications = req.files.filter(file => file.fieldname === 'certifications[]').map(file => file.path);
                updatedCaregiver = await caregiverModel.findOneAndUpdate(
                    { userId: userId },
                    {
                        $push: { certifications: { $each: newCertifications } }
                    },
                    { runValidators: true, new: true }
                );
                // console.log("caregiver certificates", updatedCaregiver.certifications)
                await updatedCaregiver.save();
            }
        }

        if (user) {
            updatedUser = await userModel.findOneAndUpdate(
                { _id: req.body.userId },
                {
                    name,
                    address,
                },
                { runValidators: true, new: true }
            );

            if (req.files && req.files.find(file => file.fieldname === "profilePicture")) {
                // Assuming profilePicture is a single file
                updatedUser.profilePicture = req.files.find(file => file.fieldname === 'profilePicture').path;
                await updatedUser.save();
            }
        }

        const data = {
            ...updatedCaregiver.toObject(),
            ...updatedUser.toObject(),
        }
        res.status(200).send({
            success: true,
            message: "Profile updated successfully",
            data
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