const bookingModel = require("../models/bookingModel");
const caregiverModel = require("../models/caregiverModel");
const userModel = require("../models/userModels");
const path = require('path');
const fs = require("fs").promises
const moment = require("moment");
const reviewModel = require("../models/reviewModel");
const subscriptionModel = require("../models/subscriptionModel");
const nodemailer = require('nodemailer')
const Mailgen = require('mailgen')

const getCaregiverInfoController = async (req, res) => {
    try {
        const caregiver = await caregiverModel.findOne({ userId: req.params.id })
        const user = await userModel.findOne({ _id: req.params.id })
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
            message: "Caregiver data fetched successfully",
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

const getBookingsController = async (req, res) => {
    try {
        const caregiverId = req.query.caregiverId;
        const bookings = await bookingModel.find({ caregiverId: caregiverId }).sort({ bookedAt: -1 });

        if (!bookings || bookings.length === 0) {
            return res.status(200).send({
                success: false,
                message: "You don't have any bookings as of now"
            });
        }

        // Extract caregiverIds from the bookings
        const clientIds = bookings.map(booking => booking.clientId);

        // Fetch caregiver details using the caregiverIds
        const clients = await userModel.find({ _id: { $in: clientIds } });

        // Map caregiver details to corresponding bookings
        const bookingsWithClientDetails = bookings.map(booking => {
            const client = clients.find(c => c._id.toString() === booking.clientId.toString());
            return {
                _id: booking._id,
                clientId: booking.clientId,
                bookedOn: booking.bookedAt,
                bookedFor: booking.bookedFor,
                date: booking.date,
                status: booking.status,
                createdAt: booking.createdAt,
                clientId: client ? client._id.toString() : null,
                clientName: client ? client.name : null,
                clientProfilePicture: client ? client.profilePicture : null
            };
        });

        res.status(200).send({
            success: true,
            message: "Successfully fetched your bookings",
            data: bookingsWithClientDetails
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while fetching bookings",
            error,
        });
    }
};

//mark booking status complete if booking is complete
// const bookingStatusController = async (req, res) => {
//     try {
//         const currentDate = moment().format("YYYY-MM-DD");

//         // Find bookings that are Approved and have an end date less than the current date
//         const bookingsToComplete = await bookingModel.find({
//             status: "Approved",
//             date: { $lt: currentDate },
//         });

//         if (bookingsToComplete.length === 0) {
//             return res.status(200).send({
//                 success: true,
//                 message: "No bookings to complete.",
//             });
//         }

//         // Update the status of each booking to "completed"
//         const updatePromises = bookingsToComplete.map(async (booking) => {
//             booking.status = "Completed";
//             await booking.save();
//         });

//         await Promise.all(updatePromises);

//         return res.status(200).send({
//             success: true,
//             message: "Bookings marked as completed.",
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({
//             success: false,
//             message: "Error while completing bookings.",
//             error,
//         });
//     }
// };

//TODO: HAVE TO ADD STATUS:COMPLETED CODE 
const bookingStatusController = async (req, res) => {
    try {
        const currentDate = moment().format("YYYY-MM-DD");

        const bookingsToUpdate = await bookingModel.find({
            $or: [
                { status: "Pending", bookedAt: { $lte: moment(currentDate).endOf('day').toDate() } },
                { status: "Approved", date: { $lt: currentDate } },
            ],
        });

        if (bookingsToUpdate.length === 0) {
            return res.status(200).send({
                success: true,
                message: "No bookings to update.",
            });
        }

        const updatePromises = bookingsToUpdate.map(async (booking) => {
            if (booking.status === "Pending") {
                const timeDifference = moment().diff(booking.bookedAt, 'hours');
                // If more than 5 hours have passed, nullify the status
                if (timeDifference >= 5) {
                    booking.status = "Nullified";
                }
            } else if (booking.status === "Approved") {
                booking.status = "Completed";
            }

            await booking.save();
        });

        await Promise.all(updatePromises);

        return res.status(200).send({
            success: true,
            message: "Bookings status updated.",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while updating bookings status.",
            error,
        });
    }
};


const approveBookingController = async (req, res) => {
    try {
        const { status, bookingId } = req.body
        const booking = await bookingModel.findOne({ _id: bookingId })
        const user = await userModel.findOne({ _id: booking?.clientId })
        const caregiver = await userModel.findOne({ _id: booking?.caregiverId })

        if (!booking) {
            return res.status(403).send({
                success: false,
                message: "No booking found"
            })
        }
        await bookingModel.findOneAndUpdate({ _id: bookingId }, { status: status }, {
            new: true, runValidators: true
        })

        const notification = user?.notification || null;
        notification.push({
            type: `booking-${status}`,
            message: `You booking has been ${status} by ${caregiver?.name}`

        })

        await user.save()

        res.status(200).send({
            success: true,
            message: "Successfully changed booking status"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while changing booking status.",
            error,
        });
    }
}

const getReviewsController = async (req, res) => {
    try {
        const reviews = await reviewModel.find({ caregiverId: req.params.caregiverId })

        const clientIds = reviews.map((review => review.clientId))

        const clients = await userModel.find({ _id: { $in: clientIds } })

        const reviewsWithClientDetails = reviews.map((review) => {
            const client = clients.find((client) => client._id.equals(review.clientId))
            return {
                ...review._doc,
                clientName: client?.name || null,
                clientProfilePicture: client?.profilePicture || null
            }
        })

        res.status(200).send({
            success: true,
            message: "Reviews fetched successfully",
            data: reviewsWithClientDetails
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while fetching reviews",
            error,
        });
    }
}

// EMAIL SENDING FUNCTION
const sendSubscriptionEmail = (user, type) => {
    let config = {
        service: 'gmail',
        auth: {
            user: process.env.BABYSITEASE_EMAIL,
            pass: process.env.BABYSITEASE_APP_PASSWORD,
        }
    }

    let transporter = nodemailer.createTransport(config)

    let mailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'Mailgen',
            link: 'https://mailgen.js/'
        }
    })

    // Subscription mail content
    const subscriptionEmailContent = {
        body: {
            name: user?.name,
            intro: `Dear ${user?.name},\n\nThank you for ${type === 'new' ? 'subscribing to' : 'updating'} our caregiver service. You are now ${type === 'new' ? 'part of' : 'updated in'} our caregiving community.`,
            action: {
                instructions: `You can ${type === 'new' ? 'explore' : 'manage'} our platform for available caregivers and ${type === 'new' ? 'manage your subscriptions.' : 'update your subscription details.'}`,
                button: {
                    color: '#22BC66',
                    text: `${type === 'new' ? 'Explore Caregivers' : 'Manage Subscriptions'}`,
                    link: `http://localhost:5173/client/${type === 'new' ? 'caregivers' : 'subscriptions'}`
                }
            },
            outro: 'Thank you for choosing our service!'
        }
    };

    let mail = mailGenerator.generate(subscriptionEmailContent)

    let message = {
        from: process.env.BABYSITEASE_EMAIL,
        to: user?.email,
        subject: `${type === 'new' ? 'Subscription Successful!' : 'Subscription Update Successful!'}`,
        html: mail
    }

    transporter.sendMail(message, (error, info) => {
        if (error) {
            console.log(error);
        }
    });
};

const subscriptionController = async (req, res) => {
    try {
        const { user_id } = req.body;

        const user = await userModel.findOne({ _id: req.body.user_id });

        if (!user || (user.role !== "babysitter" && user.role !== "nurse")) {
            return res.status(401).send({
                success: false,
                message: "You cannot subscribe as you are not a caregiver"
            });
        }

        // Check if there is an existing document with the user_id and status: Expired
        let existingSubscription = await subscriptionModel.findOne({
            user_id: req.body.user_id,
            status: "Expired",
        });

        if (existingSubscription) {
            // If exists, update the existing document with new data
            await existingSubscription.updateOne(req.body);

            sendSubscriptionEmail(user, 'update');
            res.status(200).send({
                success: true,
                message: "Subscription updated successfully",
            });
        } else {
            // If not exists, create a new document
            const newSubscription = new subscriptionModel(req.body);

            await newSubscription.save();
            sendSubscriptionEmail(user, 'new');
            res.status(201).send({
                success: true,
                message: "Subscribed successfully"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while processing subscription",
            error,
        });
    }
};

const checkSubscriptionController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.params.id });

        if (!user) {
            return res.status(401).send({
                success: false,
                message: "User not found",
            });
        }

        const currentDate = moment(new Date()).format("YYYY-MM-DD")

        let subscription = await subscriptionModel.findOne({
            user_id: req.params.id,
            status: "Active",
            expiryDate: { $lt: moment(currentDate).toDate() },
        });

        // console.log("Current Date:", moment(currentDate).toDate());
        // console.log("Subscription Expiry Date:", subscription?.expiryDate);
        if (subscription) {
            res.status(200).send({
                success: true,
                message: "Subscription is active",
                data: {
                    subscriptionStatus: "Expired"
                },
            });
        } else {
            // Subscription not found or has expired, update status if expired
            // subscription = await subscriptionModel.findOneAndUpdate(
            //     { user_id: req.params.id, status: "Active", expiryDate: { $lt: moment(currentDate).toDate() } },
            //     { $set: { status: "Expired" } },
            //     { new: true, runValidators: true }
            // );

            // if (subscription) {
            //     res.status(200).send({
            //         success: true,
            //         message: "Subscription has expired",
            //         data: {
            //             subscriptionStatus: subscription?.status
            //         },
            //     });
            // } else {
            res.status(401).send({
                success: false,
                message: "Subscription not found",
            });
            // }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while checking subscription",
            error,
        });
    }
};


const changeSubscriptionStatusController = async (req, res) => {
    try {
        const currentDate = moment(new Date()).format("YYYY-MM-DD")

        const subscription = await subscriptionModel.findOne({
            user_id: req.params?.id,
            status: "Active",
            expiryDate: { $lt: moment(currentDate).toDate() },
        });


        if (subscription) {
            subscription.status = "Expired"
            await subscription.save()
            return res.status(200).send({
                success: true,
                message: "Changed subscription status to expired",
                data: {
                    subscriptionStatus: "Expired"
                }
            })
        }
        res.status(200).send({
            message: "No subscription expired"
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while changing subscription status",
            error,
        });
    }
}


module.exports = { getCaregiverInfoController, updateCaregiverController, getBookingsController, bookingStatusController, getReviewsController, approveBookingController, subscriptionController, checkSubscriptionController, changeSubscriptionStatusController }