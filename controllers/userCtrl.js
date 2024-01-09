//import model
const userModel = require('../models/userModels')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = require('../routes/userRoutes')
const authMiddleware = require('../middlewares/authMiddleware')
const nodemailer = require('nodemailer')
const Mailgen = require('mailgen')
const caregiverModel = require('../models/caregiverModel')
const bookingModel = require('../models/bookingModel')
const moment = require("moment")


const registerController = async (req, res) => {
    try {
        const existingUser = await userModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(200).send({
                message: 'User already exists', success: false
            });
        }

        // Process profile picture upload
        const profilePicture = req.file ? req.file.path : null; // Assuming the profile picture is sent as a file

        // Your existing code for hashing the password
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;

        // Create a new user instance with the provided data
        const newUser = new userModel({
            ...req.body,
            profilePicture: profilePicture // Save the file path to the profilePicture field
        });

        // Save the user to the database
        await newUser.save();

        let config = {
            service: 'gmail',
            auth: {
                // user: 'babysitease@gmail.com',
                // pass: 'nazm oaib xcsz hxow',
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

        let response = {
            body: {
                name: req.body.name,
                intro: 'You are registered successfully with BabysitEase',
                outro: 'Looking forward to see you at BabysitEase'
            }
        }
        // if (!existingUser) {
        let mail = mailGenerator.generate(response)

        let message = {
            from: 'babysitease@gmail.com',
            to: req.body.email,
            subject: 'Registered successully!',
            html: mail
        }

        transporter.sendMail(message, (error, info) => {
            if (error) {
                console.log(error)
            } else {
                console.log(info)
            }
        })
        // }

        res.status(201).send({
            message: 'Registered sccessfully', success: true
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: `Register controller: ${error.message}`
        });
    }
};


//login callback
const loginController = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(200).send({
                message: 'User not found',
                success: false
            })
        }
        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password)
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
        if (!isPasswordMatch) {
            return res.status(200).send({
                message: 'Invalid email or password',
                success: false
            })
        }
        else {
            const newUser = user.toObject()
            newUser.password = undefined
            newUser.aadharNumber = undefined
            if (req.body.email === process.env.ADMIN_EMAIL && req.body.password === process.env.ADMIN_PASS) {
                user.isAdmin = true
                await userModel.findByIdAndUpdate(user._id, { $set: { isAdmin: true } });

                res.status(200).send({
                    message: 'Admin Login success', success: true,
                    token,
                    user: newUser
                })
            }
            else {
                res.status(200).send({
                    message: 'Login success', success: true,
                    token,
                    user: newUser
                })
            }
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: `Error in login ctrl ${error.message}`
        })
    }

}

//authController callback
const authController = async (req, res) => {
    try {
        const user = await userModel.findById({ _id: req.body.userId })
        user.password = undefined
        if (!user) {
            return res.status(200).send({
                message: 'User not found',
                success: false
            })
        }
        else {
            res.status(200).send({
                success: true,
                data: user
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ messae: 'Auth error', success: false, error })
    }
}


const applyCaregiverController = async (req, res) => {
    try {
        console.log("body", req.body)
        // Extract certificates from req.files
        const certifications = req.files ? req.files.map(file => file.path) : null;

        // Extract other form data from req.body
        const ageRange = JSON.parse(req.body.ageRange)
        // const preferredCities = JSON.parse(req.body.preferredCities)
        // const qualification = JSON.parse(req.body.qualification)
        // const specialisation = JSON.parse(req.body.specialisation)
        const {
            yearsExperience,
            feesPerDay,
            preferredCities,
            description,
            qualification,
            specialisation,
            userId,
        } = req.body;

        const existingCaregiver = await caregiverModel.findOne({ userId: userId })

        if (existingCaregiver) {
            return res.status(200).send({
                success: true,
                message: "You have already applied"
            })
        }

        const newCaregiver = await caregiverModel({
            yearsExperience,
            feesPerDay,
            preferredCities,
            description,
            qualification,
            specialisation,
            ageRange,
            userId,
            certifications,
            status: "Pending",
        });

        await newCaregiver.save();

        const existingUser = await userModel.findOne({ _id: userId });
        const adminUser = await userModel.findOne({ isAdmin: true });
        const notification = adminUser.notification;

        notification.push({
            type: "apply-nurse-request",
            message: `${existingUser.name} has applied for a nurse account`,
            data: {
                caregiverId: newCaregiver._id,
                name: existingUser.name,
                onClickPath: "/admin/nurses",
            },
        });

        await userModel.findByIdAndUpdate(adminUser._id, { notification });

        res.status(201).send({
            success: true,
            message: "Applied for nurse successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error: error,
            message: "Error while applying for nurse",
        });
    }
};


//ALL NOTIFICATIONS
const getNotificationsController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId })
        const seenNotification = user.seenNotification
        const notification = user.notification
        seenNotification.push(...notification)
        user.notification = []
        user.seenNotification = notification
        const updatedUser = await user.save()
        res.status(200).send({
            success: true,
            message: 'All notification marked as read',
            data: updatedUser
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in notifications"
        })
    }
}

//DELETE NOTIFICATIONS
const deleteNotificationsController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId })
        user.notification = []
        user.seenNotification = []
        const updatedUser = await user.save()
        updatedUser.password = undefined
        res.status(200).send({
            success: true,
            message: "Notifications deleted successfully",
            data: updatedUser
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while deleting notifications", error
        })
    }
}


//ADD DEPENDENT CONTROLLER
const addDependentController = async (req, res) => {
    try {
        const { _id, type, gender, name, age, allergies, medicalConditions } = req.body;
        // Find the user by _id
        const existingUser = await userModel.findOne({ _id });

        // Check if the user already has a parent or child dependent
        const hasParentDependent = existingUser.dependents.some(
            (dependent) => dependent.type === "Parent"
        );

        const hasChildDependent = existingUser.dependents.some(
            (dependent) => dependent.type === "Child"
        );

        // If trying to add a parent dependent and already has one, or trying to add a child dependent and already has one, return an error
        if (
            (type === "Parent" && hasParentDependent) ||
            (type === "Child" && hasChildDependent)
        ) {
            return res.status(400).send({
                success: false,
                message: `User already has a ${dependentType} dependent`,
            });
        }

        // If the user doesn't have a dependent of the same type, proceed to add the new dependent
        const updatedUser = await userModel.findByIdAndUpdate(
            { _id },
            {
                $push: {
                    dependents: {
                        type, gender, name, age, allergies, medicalConditions
                    },
                },
            },
            { new: true, runValidators: true }
        );

        return res.status(200).send({
            success: true,
            message: "Dependent added successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while adding dependent",
            error,
        });
    }
};

const getAllCaregiversController = async (req, res) => {
    try {
        // Find caregivers with status "Approved"
        const caregivers = await caregiverModel.find({ status: "Approved" });

        // Extract userIds from the caregivers
        const userIds = caregivers.map(caregiver => caregiver.userId);

        // Find users with isCaregiver set to true and matching userIds
        const caregiverUsers = await userModel.find({
            isCaregiver: true,
            _id: { $in: userIds },
        });

        // Create a mapping of userId to user information
        const userMap = {};
        caregiverUsers.forEach(user => {
            userMap[user._id] = user;
        });

        // Combine user and caregiver information into one object
        const caregiversCombined = caregivers.map(caregiver => ({
            ...caregiver.toObject(),  // Convert Mongoose document to plain JavaScript object
            user: userMap[caregiver.userId], // Add user information
        }));


        // Send the combined data in the response
        res.status(200).send({
            success: true,
            message: "Caregivers and users retrieved successfully",
            data: caregiversCombined,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error while getting caregivers and users",
            error,
        });
    }
};


const getCaregiverDetails = async (req, res) => {
    try {
        const caregiver = await caregiverModel.findOne({ userId: req.params.userId })
        const user = await userModel.findOne({ _id: req.params.userId })
        let caregiverData = {
            ...caregiver?.toObject(),
            ...user?.toObject(),
        }
        res.status(200).send({
            success: true,
            message: "Caregiver data fetched successfully",
            data: caregiverData
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while adding dependent",
            error,
        });
    }
}

const bookCaregiverController = async (req, res) => {
    try {
        const { clientId, caregiverId, date, } = req.body

        const formattedDate = moment(date).format("YYYY-MM-DD");
        const user = await userModel.findOne({ _id: clientId })
        const caregiver = await caregiverModel.findOne({ userId: caregiverId })
        const bookedFor = caregiver?.role === "babysitter" ? "Child" : "Parent"

        if (!user?.role === "client") {
            return res.status(200).send({
                success: false,
                message: "You cannot book caregiver"
            })
        }

        if (!caregiver.availability) {
            return res.status(200).send({
                success: false,
                message: "Caregiver is unavailable right now"
            })
        }

        const existingBooking = await bookingModel.findOne({
            clientId: user?._id,
            date: formattedDate,
        });


        if (existingBooking) {
            return res.status(200).send({
                success: false,
                message: "You already have a booking for the same day"
            });
        }

        // Check if the caregiver is already booked on the specified date
        const existingCaregiverBooking = await bookingModel.findOne({
            caregiverId: caregiverId,
            date: formattedDate,
        });

        if (existingCaregiverBooking) {
            return res.status(200).send({
                success: false,
                message: "Caregiver is already booked on the specified date"
            });
        }

        // Check if the caregiver is booked for a date less than the current booking date
        const previousBooking = await bookingModel.findOne({
            caregiverId: caregiverId,
            $or: [
                { status: "Pending" },
                { status: "Accepted" }
            ],
        });

        if (previousBooking) {
            return res.status(200).send({
                success: false,
                message: "You cannot book a caregiver for a new date until the previous booking is finished"
            });
        }

        const booking = await bookingModel({ clientId, caregiverId, date: formattedDate, bookedFor })

        await booking.save()
        //FIXME: USER NOTIFICATIONS
        const userNotif = await userModel.findOne({ _id: caregiverId })
        userNotif.notification.push({
            type: "New-booking-request",
            message: `You have a booking from ${user.name}`,
            onClickPath: "/booking"
        });

        await userNotif.save();
        res.status(200).send({
            success: true,
            message: "You have successfully booked a caregiver"
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while booking caregiver",
            error,
        });
    }
}

const getBookingsController = async (req, res) => {
    try {
        const clientId = req.query.clientId;
        const bookings = await bookingModel.find({ clientId: clientId });

        if (!bookings || bookings.length === 0) {
            return res.status(200).send({
                success: false,
                message: "You don't have any bookings as of now"
            });
        }

        // Extract caregiverIds from the bookings
        const caregiverIds = bookings.map(booking => booking.caregiverId);

        // Fetch caregiver details using the caregiverIds
        const caregivers = await userModel.find({ _id: { $in: caregiverIds } });

        // Map caregiver details to corresponding bookings
        const bookingsWithCaregiverDetails = bookings.map(booking => {
            const caregiver = caregivers.find(c => c._id.toString() === booking.caregiverId.toString());
            return {
                _id: booking._id,
                clientId: booking.clientId,
                bookedFor: booking.bookedFor,
                date: booking.date,
                status: booking.status,
                createdAt: booking.createdAt,
                caregiverId: caregiver ? caregiver._id.toString() : null,
                caregiverName: caregiver ? caregiver.name : null,
                caregiverProfilePicture: caregiver ? caregiver.profilePicture : null
            };
        });

        res.status(200).send({
            success: true,
            message: "Successfully fetched your bookings",
            data: bookingsWithCaregiverDetails
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


module.exports = { loginController, registerController, authController, applyCaregiverController, getNotificationsController, deleteNotificationsController, addDependentController, getAllCaregiversController, getCaregiverDetails, bookCaregiverController, getBookingsController }